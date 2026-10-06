import { spawn } from 'node:child_process';
import { appendFile, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const command = process.env.LK_CLAUDE_BIN || 'claude';
const bound = 180_000;

function stop(child) {
  if (process.platform === 'win32' && child.pid) {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' });
    killer.on('error', () => child.kill());
  } else child.kill('SIGKILL');
}

// A nested run must not inherit the calling session's identity, or it would reuse that session.
function cleanEnvironment() {
  const env = { ...process.env };
  delete env.CLAUDE_CODE_SESSION_ID;
  delete env.CLAUDE_CODE_CHILD_SESSION;
  return env;
}

export function execute(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: options.cwd, env: cleanEnvironment(), windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '', reason;
    const timer = setTimeout(() => { reason = 'Claude turn timed out'; stop(child); }, options.timeout ?? bound);
    const collect = (channel, data) => {
      if (channel === 'out') stdout += data; else stderr += data;
      if (stdout.length + stderr.length > 8_000_000) { reason = 'Claude output exceeded 8 MB'; stop(child); }
    };
    child.stdout.on('data', data => collect('out', data));
    child.stderr.on('data', data => collect('err', data));
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => { clearTimeout(timer); resolve({ code, stdout, stderr, reason }); });
    child.stdin.on('error', () => {});
    child.stdin.end(options.prompt);
  });
}

// Every turn runs from the repository as an inline plugin, so the source revision is what is under test.
// No tools are enabled: the skill text is injected by the host, and the model cannot read or change files.
export function turnArguments({ root, model, session }) {
  const args = ['-p', '--output-format', 'stream-json', '--verbose', '--plugin-dir', root, '--tools', '', '--setting-sources', '', '--model', model];
  if (session) args.push('--resume', session);
  return args;
}

export function parseEvents(stdout) {
  return stdout.trim().split(/\r?\n/u).filter(Boolean).flatMap(line => { try { return [JSON.parse(line)]; } catch { return []; } });
}

// Uses the host's own report of loaded skills from the first system event of a real session.
export async function preflight(root, names, prefix = 'learner-kit:', model, runtime = { execute }) {
  const version = await runtime.execute(['--version'], { timeout: 10_000 });
  if (version.code) throw new Error(version.stderr || 'Claude executable unavailable');
  const auth = await runtime.execute(['auth', 'status'], { timeout: 10_000 });
  let status;
  try { status = JSON.parse(auth.stdout); } catch { /* handled below */ }
  if (auth.code || !status?.loggedIn) throw new Error(`Authentication preflight: ${(auth.stderr || auth.stdout).trim()}`);
  const cwd = await mkdtemp(join(tmpdir(), 'learner-kit-synthetic-'));
  const cleanup = () => rm(cwd, { recursive: true, force: true });
  try {
    const probe = await runtime.execute(turnArguments({ root, model: model ?? 'sonnet' }), { cwd, prompt: 'Reply with the single word ok.' });
    if (probe.code || probe.reason) throw new Error(probe.reason || `Claude exited ${probe.code}: ${probe.stderr.slice(-1500)}`);
    const init = parseEvents(probe.stdout).find(event => event.type === 'system' && event.subtype === 'init');
    if (!init) throw new Error('Claude did not report its loaded skills');
    const installed = [];
    for (const name of names) {
      const variants = init.skills.filter(skill => skill.split(':').at(-1) === name);
      if (variants.length !== 1) throw new Error(`Need exactly one installation of ${name}; found ${variants.length}: ${variants.join(', ')}. Remove duplicate direct/plugin installations before running.`);
      if (variants[0] !== `${prefix}${name}`) throw new Error(`Expected ${prefix}${name}; found ${variants[0]}. Check --skill-prefix.`);
      installed.push({ name, loaded: variants[0], plugin: init.plugins?.find(plugin => plugin.path === root)?.version ?? null });
    }
    return { version: version.stdout.trim(), cwd, root, model: init.model, installed, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

export class ClaudeAdapter {
  constructor({ cwd, root, model, eventFile }) { this.cwd = cwd; this.root = root; this.model = model; this.eventFile = eventFile; }
  async turn(prompt, { image } = {}) {
    if (image) throw Object.assign(new Error('Headless Claude cannot attach the image; run image scenarios on another host'), { blocked: true });
    const result = await execute(turnArguments({ root: this.root, model: this.model, session: this.session }), { cwd: this.cwd, prompt });
    await appendFile(this.eventFile, result.stdout);
    if (result.code || result.reason) throw new Error(result.reason || `Claude exited ${result.code}: ${result.stderr.slice(-1500)}`);
    const events = parseEvents(result.stdout);
    const final = events.find(event => event.type === 'result');
    if (!final || final.is_error || final.subtype !== 'success') throw new Error('Assistant turn did not complete');
    this.session ??= final.session_id;
    if (!this.session) throw new Error('No session ID; cannot safely continue');
    return { text: final.result, thread: this.session };
  }
}

export async function sourceVersion(root) {
  return JSON.parse(await readFile(join(root, '.claude-plugin/plugin.json'), 'utf8')).version;
}
