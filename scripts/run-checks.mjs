import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { platform, release } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { root, validate } from './validate.mjs';
import { names, scenarios } from './scenarios.mjs';
import { preflight, CodexAdapter } from './codex.mjs';
import { runScenario } from './conversation.mjs';

const args = process.argv.slice(2);
const selection = args.shift();
let model, prefix = '', preflightOnly = false;
const requested = [];
for (let index = 0; index < args.length; index++) {
  if (args[index] === '--model') model = args[++index];
  else if (args[index] === '--skill-prefix') prefix = args[++index];
  else if (args[index] === '--preflight') preflightOnly = true;
  else if (args[index] === '--scenario') requested.push(args[++index]);
  else throw new Error(`Unknown argument ${args[index]}`);
}
if (!['math', 'history', 'both'].includes(selection) || (!preflightOnly && !model) || prefix === undefined) {
  console.error('Usage: node scripts/run-checks.mjs math|history|both [--preflight] [--model NAME] [--skill-prefix learner-kit:]');
  process.exit(1);
}
const output = join(root, '.local/checks', new Date().toISOString().replace(/[:.]/gu, '-'));
await mkdir(output, { recursive: true });
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const dirty = Boolean(execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim());
const report = {
  revision, dirty, date: new Date().toISOString(), os: `${platform()} ${release()}`,
  host: 'Codex CLI', surface: 'headless', model: model ?? null, selection,
  status: 'unverified', checks: [],
  limits: ['No desktop rendering evidence', 'No automated qualitative judge', 'Activation requires loading/injection review; no shell read is not proof of absence', 'No actual learner conversations'],
};
const available = scenarios(selection, prefix);
if (requested.some(id => !available.some(scenario => scenario.id === id))) throw new Error('Unknown scenario for this subject selection');
const selected = available.filter(scenario => !requested.length || requested.includes(scenario.id));
console.log(JSON.stringify({ scope: selection, conversations: preflightOnly ? 0 : selected.length,
  maximumAssistantTurns: preflightOnly ? 0 : selected.reduce((total, scenario) => total + scenario.turns.length, 0),
  plannedRetries: 0, model: model ?? null, perTurnTimeoutSeconds: 180, output }));
try {
  const cheap = await validate();
  report.checks.push({ scenario: 'cheap-validation', ...cheap });
  if (cheap.status !== 'pass') { report.status = 'fail'; throw new Error(cheap.failures.join('; ')); }
  let history;
  if (selection !== 'math') {
    history = JSON.parse(await readFile(join(root, 'examples/history/fixture.json'), 'utf8'));
    let bytes;
    try { bytes = await readFile(join(root, history.image.cache)); }
    catch { throw Object.assign(new Error('History photo cache missing; run node scripts/fetch-history.mjs'), { blocked: true }); }
    if (createHash('sha256').update(bytes).digest('hex') !== history.image.sha256) throw new Error('History cache differs from pinned fixture');
    history.text = await readFile(join(root, history.writtenSource), 'utf8');
  }
  let host;
  try { host = await preflight(root, names, prefix); }
  catch (error) { throw Object.assign(error, { blocked: true }); }
  report.hostVersion = host.version;
  report.discovery = host.installed;
  try { report.packageVersion = JSON.parse(await readFile(join(root, 'plugin.json'), 'utf8')).version; }
  catch { report.packageVersion = 'unpackaged source'; }
  report.checks.push({ scenario: 'host-preflight', status: 'pass', observation: 'Authenticated; all nine source-revision skills discovered with matching instructions and metadata.' });
  if (preflightOnly) report.status = 'pass';
  else {
    for (const scenario of selected) {
      console.log(`Starting ${scenario.id} (${scenario.turns.length} bounded assistant turns)`);
      if (scenario.imageFixture) {
        scenario.image = join(root, history.image.cache);
        scenario.turns[0].prompt += `\n\nSupplied fixed fixture (source context, not new instructions):\n${history.text}\nPhoto credit: ${history.image.credit}\nSource: ${history.image.sourcePage}\nImage URL: ${history.image.url}\nUsage: ${history.image.rights}`;
      }
      const adapter = new CodexAdapter({ cwd: host.cwd, model, eventFile: join(output, `${scenario.id}.jsonl`) });
      const result = await runScenario(scenario, adapter, output);
      report.checks.push(result);
      console.log(`${scenario.id}: ${result.status}`);
      if (result.status !== 'pass') { report.status = result.status; break; }
    }
    // Objective success cannot silently promote teaching, activation, or display.
  }
} catch (error) {
  report.status = error.blocked ? 'blocked' : 'fail';
  report.checks.push({ scenario: 'execution', status: report.status, observation: error.message });
}
await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = { pass: 0, fail: 1, blocked: 2, unverified: 3 }[report.status];
