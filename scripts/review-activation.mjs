import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { root } from './validate.mjs';
import { inspectActivation } from './history.mjs';

const directory = resolve(process.argv[2] ?? '');
if (!directory.startsWith(join(root, '.local/checks') + sep)) throw new Error('Choose a runner output directory under .local/checks');
const results = [];
for (const file of await readdir(directory)) {
  if (!file.endsWith('.json') || ['report.json', 'activation.json'].includes(file)) continue;
  const transcript = JSON.parse(await readFile(join(directory, file), 'utf8'));
  if (transcript.synthetic !== true || !transcript.turns?.length) continue;
  const thread = transcript.turns[0].reply?.thread;
  const expected = transcript.turns[0].prompt.match(/\$((?:learner-kit:)?lk-[a-z]+)/u)?.[1];
  const result = await inspectActivation(thread, expected, transcript.turns.length);
  results.push({ scenario: transcript.scenario, thread, expected: expected ?? null, ...result });
}
const report = { scope: 'Exact generated synthetic threads only', results };
await writeFile(join(directory, 'activation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = results.some(result => result.status === 'fail') ? 1 : results.length && results.every(result => result.status === 'pass') ? 0 : 3;
