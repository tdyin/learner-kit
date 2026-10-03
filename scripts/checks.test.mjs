import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, cp, mkdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { runScenario, checkReply } from './conversation.mjs';
import { root, validate } from './validate.mjs';
import { inspectActivation } from './history.mjs';
import { scenarios } from './scenarios.mjs';
import { preflight } from './codex.mjs';

for (const outcome of ['success', 'discovery failure', 'validation failure']) {
  test(`preflight workspace is removed after ${outcome}`, async t => {
    let cwd;
    t.after(async () => { if (cwd) await rm(cwd, { recursive: true, force: true }); });
    const runtime = {
      async execute(args) { return { code: 0, stdout: args[0] === '--version' ? 'synthetic-host' : 'Logged in (synthetic)', stderr: '' }; },
      async discover(path) {
        cwd = path;
        if (outcome === 'discovery failure') throw new Error('Synthetic discovery failure');
        return outcome === 'validation failure' ? [] : [{ name: 'lk-learn', path: join(root, 'skills/lk-learn/SKILL.md'), scope: 'synthetic' }];
      },
    };
    if (outcome === 'success') {
      const host = await preflight(root, ['lk-learn'], '', runtime);
      assert.ok((await stat(host.cwd)).isDirectory());
      await host.cleanup();
    } else {
      await assert.rejects(preflight(root, ['lk-learn'], '', runtime), outcome === 'discovery failure' ? /Synthetic discovery failure/u : /exactly one/u);
    }
    await assert.rejects(stat(cwd), { code: 'ENOENT' });
  });
}

async function temporaryFixture(t, prefix) {
  const path = await mkdtemp(join(tmpdir(), prefix));
  t.after(() => rm(path, { recursive: true, force: true }));
  return path;
}

async function publicSource(t) {
  const fixture = await temporaryFixture(t, 'learner-kit-package-');
  await cp(root, fixture, { recursive: true, filter: source => {
    const path = relative(root, source).split(sep).join('/');
    return !['.git', '.local', 'docs/results', 'docs/smoke-checks.md', 'docs/release-acceptance.md'].some(excluded => path === excluded || path.startsWith(`${excluded}/`));
  } });
  return fixture;
}

test('public source validates without any local result records', async t => {
  assert.equal((await validate(await publicSource(t))).status, 'pass');
});

test('a recall cue can keep its slot pending without repeating the question', () => {
  const branch = scenarios('math').find(scenario => scenario.id === 'math-recall-completion');
  assert.deepEqual(checkReply('Question 1 of 2 ▱▱\nThink of a number you can add without changing a value.', branch.turns[1].expect), []);
  assert.ok(checkReply('Question 2 of 2 ▰▱\nThe answer is zero.', branch.turns[1].expect).length);
});

test('a completion marker without recognized conversation history cannot prove no activation', async t => {
  const sessions = await temporaryFixture(t, 'learner-kit-history-');
  const date = join(sessions, '2026/10/03');
  await mkdir(date, { recursive: true });
  const id = '01a10398-8b26-7092-9d02-27c1c3edf3f1';
  await writeFile(join(date, `rollout-${id}.jsonl`), JSON.stringify({ type: 'event_msg', payload: { type: 'task_complete' } }));
  assert.equal((await inspectActivation(id, undefined, 1, sessions)).status, 'unverified');
});

test('equivalent mathematical minus glyphs pass numeric cues and still catch leaked answers', () => {
  assert.deepEqual(checkReply('−3 + 2 = −1', { present: ['-3', '-1'] }), []);
  assert.equal(checkReply('−3 + 2 = −1', { absent: ['=\\s*-1'] }).length, 1);
});

test('math hints reject the withheld answer in prose and diagrams regardless of phrasing', () => {
  const expect = scenarios('math').find(scenario => scenario.id === 'math-coach').turns[0].expect;
  for (const text of ['You get -1. Which direction did you move?', 'Your endpoint is −1. What changed?', '-3 → -2 → -1\nWhere did you land?']) {
    assert.ok(checkReply(text, expect).some(failure => failure.startsWith('Forbidden')), text);
  }
  assert.deepEqual(checkReply('Start at −3 and move right. Which position comes next?', expect), []);
  assert.deepEqual(checkReply('Imagine starting at -11 or -1.5. Which direction is positive?', expect), []);
});

test('cheap validation rejects host packages with inconsistent release versions', async t => {
  const fixture = await publicSource(t);
  const path = join(fixture, '.claude-plugin/plugin.json');
  const manifest = JSON.parse(await readFile(path, 'utf8'));
  manifest.version = '99.0.0';
  await writeFile(path, JSON.stringify(manifest));
  const result = await validate(fixture);
  assert.equal(result.status, 'fail');
  assert.ok(result.failures.some(failure => /version/iu.test(failure)));
});

test('an empty assistant reply cannot pass or advance the script', async t => {
  const output = await temporaryFixture(t, 'learner-kit-check-');
  const result = await runScenario({ id: 'empty', turns: [{ prompt: 'Help' }] }, {
    async turn() { return { text: '' }; },
  }, output);
  assert.equal(result.status, 'fail');
});

test('a divergent assistant turn stops before the synthetic learner response', async t => {
  const output = await temporaryFixture(t, 'learner-kit-check-');
  const prompts = [];
  const adapter = { async turn(prompt) {
    prompts.push(prompt);
    return { text: 'You get −1. Which direction did you move?', thread: 'synthetic-adapter' };
  } };
  const result = await runScenario({ id: 'hint', turns: [
    scenarios('math').find(scenario => scenario.id === 'math-coach').turns[0],
    { prompt: 'I think 5.' },
  ] }, adapter, output);
  assert.equal(result.status, 'fail');
  assert.equal(prompts.length, 1);
  const transcript = JSON.parse(await readFile(join(output, 'hint.json'), 'utf8'));
  assert.equal(transcript.turns.length, 1);
  assert.equal(transcript.turns[0].inputKind, 'synthetic learner input');
});

test('unavailable runtime is blocked and never receives a learner turn', async t => {
  const output = await temporaryFixture(t, 'learner-kit-check-');
  const result = await runScenario({ id: 'missing-runtime', turns: [{ prompt: 'stop' }, { prompt: 'next' }] }, {
    async turn() { throw Object.assign(new Error('Codex authentication unavailable'), { blocked: true }); },
  }, output);
  assert.equal(result.status, 'blocked');
  assert.equal(result.qualitative, 'unverified');
  assert.equal(result.desktopRendering, 'unverified');
});

test('sequential turns continue only after the assistant has answered', async t => {
  const output = await temporaryFixture(t, 'learner-kit-check-');
  let finished = false;
  const result = await runScenario({ id: 'continuation', turns: [
    { prompt: 'Give me a hint', expect: { question: true } },
    { prompt: 'stop', expect: { question: false, maxWords: 10 } },
  ] }, { async turn(prompt) {
    if (prompt === 'stop') { assert.equal(finished, true); return { text: 'Stopped.' }; }
    await new Promise(resolve => setTimeout(resolve, 5));
    finished = true;
    return { text: 'Which direction does positive addition move?' };
  } }, output);
  assert.equal(result.status, 'pass');
  assert.equal(result.qualitative, 'unverified');
});
