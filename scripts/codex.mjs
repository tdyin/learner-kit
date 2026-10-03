import { spawn } from 'node:child_process';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const command = process.env.LK_CODEX_BIN || 'codex';
const bound = 180_000;

function stop(child) {
  if (process.platform === 'win32' && child.pid) {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' });
    killer.on('error', () => child.kill());
  } else child.kill('SIGKILL');
}

export function execute(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', reason;
    const timer = setTimeout(() => { reason = 'Codex turn timed out'; stop(child); }, options.timeout ?? bound);
    const collect = (channel, data) => {
      if (channel === 'out') stdout += data; else stderr += data;
      if (stdout.length + stderr.length > 8_000_000) { reason = 'Codex output exceeded 8 MB'; stop(child); }
    };
    child.stdout.on('data', data => collect('out', data));
    child.stderr.on('data', data => collect('err', data));
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => { clearTimeout(timer); resolve({ code, stdout, stderr, reason }); });
    child.stdin.on('error', () => {});
    child.stdin.end(options.prompt);
  });
}

// Use the host's discovery mechanism; a directory listing is not host discovery.
export async function discover(cwd) {
  const child = spawn(command, ['app-server'], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  const pending = new Map();
  let sequence = 0, stderr = '';
  child.stderr.on('data', data => { stderr = (stderr + data).slice(-2000); });
  const fail = error => { for (const entry of pending.values()) entry.reject(error); pending.clear(); };
  child.on('error', fail);
  child.on('close', () => fail(new Error(`Discovery server closed: ${stderr}`)));
  child.stdin.on('error', fail);
  const lines = createInterface({ input: child.stdout });
  lines.on('line', line => {
    let message;
    try { message = JSON.parse(line); } catch { return; }
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
    else entry.resolve(message.result);
  });
  const request = (method, params) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Discovery timeout: ${method}`)); }, 20_000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    child.stdin.write(JSON.stringify({ id, method, params }) + '\n');
  });
  try {
    await request('initialize', { clientInfo: { name: 'learner-kit-checks', version: '1.0.0' } });
    child.stdin.write(JSON.stringify({ method: 'initialized', params: {} }) + '\n');
    const result = await request('skills/list', { cwds: [cwd], forceReload: true });
    const errors = result.data.flatMap(entry => entry.errors ?? []);
    if (errors.length) throw new Error(`Skill loader errors: ${JSON.stringify(errors)}`);
    return result.data.flatMap(entry => entry.skills);
  } finally { lines.close(); stop(child); }
}

export async function preflight(root, names, prefix = '', runtime = { execute, discover }) {
  const version = await runtime.execute(['--version'], { timeout: 10_000 });
  if (version.code) throw new Error(version.stderr || 'Codex executable unavailable');
  const auth = await runtime.execute(['login', 'status'], { timeout: 10_000 });
  if (auth.code || !/logged in/iu.test(auth.stdout + auth.stderr)) {
    throw new Error(`Authentication preflight: ${(auth.stderr || auth.stdout).trim()}`);
  }
  const cwd = await mkdtemp(join(tmpdir(), 'learner-kit-synthetic-'));
  const cleanup = () => rm(cwd, { recursive: true, force: true });
  try {
    const skills = await runtime.discover(cwd);
    const digest = data => createHash('sha256').update(data).digest('hex');
    const installed = [];
    for (const name of names) {
      const matches = skills.filter(skill => skill.name === `${prefix}${name}`);
      if (matches.length !== 1) throw new Error(`Need exactly one discovered ${prefix}${name}; found ${matches.length}. Install the source revision under test and check --skill-prefix and duplicate selectable names.`);
      const skill = matches[0];
      const source = await readFile(join(root, 'skills', name, 'SKILL.md'));
      const actual = await readFile(skill.path);
      if (digest(source) !== digest(actual)) throw new Error(`Installed ${name} differs from source. Refresh the installed package before running.`);
      const policyPath = join(skill.path, '..', 'agents', 'openai.yaml');
      const policy = await readFile(policyPath);
      if (digest(policy) !== digest(await readFile(join(root, 'skills', name, 'agents', 'openai.yaml')))) throw new Error(`Installed ${name} policy differs from source.`);
      installed.push({ name, path: skill.path, sha256: digest(actual), scope: skill.scope });
    }
    return { version: version.stdout.trim(), cwd, installed, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

export class CodexAdapter {
  constructor({ cwd, model, eventFile }) { this.cwd = cwd; this.model = model; this.eventFile = eventFile; }
  async turn(prompt, { image } = {}) {
    const args = ['exec'];
    if (this.thread) args.push('resume', this.thread);
    else args.push('--sandbox', 'read-only', '-C', this.cwd);
    args.push('-c', 'approval_policy="never"', '-c', 'sandbox_mode="read-only"', '--skip-git-repo-check', '--json', '-m', this.model);
    if (image) args.push('--image', image);
    args.push('-');
    const result = await execute(args, { cwd: this.cwd, prompt });
    const { appendFile } = await import('node:fs/promises');
    await appendFile(this.eventFile, result.stdout);
    if (result.code || result.reason) throw new Error(result.reason || `Codex exited ${result.code}: ${result.stderr.slice(-1500)}`);
    const events = result.stdout.trim().split(/\r?\n/u).filter(Boolean).map(line => JSON.parse(line));
    this.thread ??= events.find(event => event.type === 'thread.started')?.thread_id;
    if (!this.thread) throw new Error('No thread ID; cannot safely continue');
    if (!events.some(event => event.type === 'turn.completed')) throw new Error('Assistant turn did not complete');
    const text = events.filter(event => event.type === 'item.completed' && event.item?.type === 'agent_message').map(event => event.item.text).join('\n');
    return { text, thread: this.thread };
  }
}
