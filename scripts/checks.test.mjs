import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, cp, mkdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { runScenario, checkReply } from './conversation.mjs';
import { root, validate } from './validate.mjs';
import { inspectActivation } from './history.mjs';
import { scenarios, historyContext } from './scenarios.mjs';
import { preflight } from './codex.mjs';
import { preflight as claudePreflight, turnArguments, parseEvents } from './claude.mjs';

for (const prefix of ['', 'learner-kit:']) {
  test(`preflight blocks direct/plugin duplicates when selecting ${prefix || 'direct'} skills`, async t => {
    let cwd;
    t.after(async () => { if (cwd) await rm(cwd, { recursive: true, force: true }); });
    const runtime = {
      async execute() { return { code: 0, stdout: 'Logged in (synthetic)', stderr: '' }; },
      async discover(path) {
        cwd = path;
        return ['lk-learn', 'learner-kit:lk-learn'].map(name => ({ name, path: join(root, 'skills/lk-learn/SKILL.md'), scope: 'synthetic' }));
      },
    };
    await assert.rejects(preflight(root, ['lk-learn'], prefix, runtime), /exactly one installation/u);
  });
}

test('history conversation receives archive context without the reviewer conclusion', async t => {
  const fixture = JSON.parse(await readFile(join(root, 'examples/history/fixture.json'), 'utf8'));
  fixture.text = await readFile(join(root, fixture.writtenSource), 'utf8');
  const output = await temporaryFixture(t, 'learner-kit-history-context-');
  const scenario = scenarios('history').find(branch => branch.id === 'history-coach');
  const turn = { ...scenario.turns[0], prompt: scenario.turns[0].prompt + historyContext(fixture) };
  let received;
  await runScenario({ id: 'history-context', turns: [turn] }, {
    async turn(prompt) { received = prompt; return { text: 'What do you see in the photograph?' }; },
  }, output);
  for (const fact of [fixture.period, fixture.image.creator, fixture.uncertainty, fixture.image.credit, fixture.image.sourcePage, fixture.image.rights]) assert.ok(received.includes(fact), fact);
  assert.doesNotMatch(received, /cannot establish national public opinion|does not, by itself, establish how everyone felt/u);
});

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
  const id = '01a10398-8b26-7092-9d02-27c1c3edf3f1';
  const timestamp = new Date(parseInt(id.replaceAll('-', '').slice(0, 12), 16));
  const date = join(sessions, String(timestamp.getFullYear()), String(timestamp.getMonth() + 1).padStart(2, '0'), String(timestamp.getDate()).padStart(2, '0'));
  await mkdir(date, { recursive: true });
  await writeFile(join(date, `rollout-${id}.jsonl`), JSON.stringify({ type: 'event_msg', payload: { type: 'task_complete' } }));
  const result = await inspectActivation(id, undefined, 1, sessions);
  assert.equal(result.status, 'unverified');
  assert.match(result.observation, /^Recognized user\/assistant history unavailable/u);
});

test('equivalent mathematical minus glyphs pass numeric cues and still catch leaked answers', () => {
  assert.deepEqual(checkReply('−3 + 2 = −1', { present: ['-3', '-1'] }), []);
  assert.equal(checkReply('−3 + 2 = −1', { absent: ['=\\s*-1'] }).length, 1);
});

test('math hints reject the withheld answer in prose and diagrams regardless of phrasing', () => {
  const expect = scenarios('math').find(scenario => scenario.id === 'math-coach').turns[0].expect;
  for (const text of [
    'You get -1. Which direction did you move?',
    'Your endpoint is −1. What changed?',
    '-3 → -2 → -1\nWhere did you land?',
    'The answer is negative one. Which direction did you move?',
    'You land at minus one. What changed?',
    'You get Negative-One. Where did you land?',
    'You land at − 1. Which direction did you move?',
    'You get -\t1. What changed?',
    'Your endpoint is negative 1. Where did you land?',
    'You get minus 1. Which direction did you move?',
  ]) {
    assert.ok(checkReply(text, expect).some(failure => failure.startsWith('Forbidden')), text);
  }
  assert.deepEqual(checkReply('Start at −3 and move right. Which position comes next?', expect), []);
  assert.deepEqual(checkReply('Imagine starting at -11 or -1.5. Which direction is positive?', expect), []);
  assert.deepEqual(checkReply('Imagine negative 11 or minus 1.5. Which direction is positive?', expect), []);
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

test('cheap validation enforces skill-authoring best practices', async t => {
  const fixture = await publicSource(t);
  const path = join(fixture, 'skills/lk-coach/SKILL.md');
  const skill = await readFile(path, 'utf8');
  await writeFile(path, skill
    .replace(/^description: .*$/mu, 'description: We help with <b>homework</b>.')
    .replace('## Minimum input', '[Details](details.md "Details")\n\n## Minimum input'));
  await writeFile(join(fixture, 'skills/lk-coach/details.md'), 'See [more](more.md).\n');
  await writeFile(join(fixture, 'skills/lk-coach/more.md'), 'More.\n');
  const { status, failures } = await validate(fixture);
  assert.equal(status, 'fail');
  for (const rule of [/XML tags/u, /third person/u, /when to use/u, /one level deep/u]) {
    assert.ok(failures.some(failure => rule.test(failure)), String(rule));
  }
});

test('the SKILL.md body limit ignores the final newline', async t => {
  const fixture = await publicSource(t);
  const path = join(fixture, 'skills/lk-coach/SKILL.md');
  const skill = await readFile(path, 'utf8');
  const front = skill.slice(0, skill.indexOf('\n---', 3) + 5);
  await writeFile(path, `${front}${'line\n'.repeat(499)}`);
  assert.equal((await validate(fixture)).status, 'pass');
  await writeFile(path, `${front}${'line\n'.repeat(500)}`);
  assert.ok((await validate(fixture)).failures.some(failure => /500 lines/u.test(failure)));
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

test('Claude turns load this checkout as a plugin with no tools and resume by exact session', () => {
  const first = turnArguments({ root: '/repo', model: 'sonnet' });
  assert.deepEqual(first.slice(first.indexOf('--plugin-dir'), first.indexOf('--plugin-dir') + 2), ['--plugin-dir', '/repo']);
  assert.deepEqual(first.slice(first.indexOf('--tools'), first.indexOf('--tools') + 2), ['--tools', '']);
  assert.ok(!first.includes('--resume'));
  const next = turnArguments({ root: '/repo', model: 'sonnet', session: 'abc' });
  assert.deepEqual(next.slice(next.indexOf('--resume'), next.indexOf('--resume') + 2), ['--resume', 'abc']);
  assert.deepEqual(parseEvents('{"type":"a"}\nnot json\n{"type":"b"}\n').map(event => event.type), ['a', 'b']);
});

test('Claude selection uses the slash form with the plugin namespace', () => {
  const [turn] = scenarios('math', 'learner-kit:', '/').find(scenario => scenario.id === 'math-coach').turns;
  assert.match(turn.prompt, /^\/learner-kit:lk-coach /u);
});

test('Claude preflight blocks duplicate or missing skills and unauthenticated hosts', async t => {
  const version = JSON.parse(await readFile(join(root, '.claude-plugin/plugin.json'), 'utf8')).version;
  const init = (skills, plugins = [{ path: root, version }]) => JSON.stringify({ type: 'system', subtype: 'init', model: 'synthetic', skills, plugins }) + '\n';
  const runtime = (skills, loggedIn = true, plugins) => ({ async execute(args) {
    if (args[0] === '--version') return { code: 0, stdout: '1.0.0', stderr: '' };
    if (args[0] === 'auth') return { code: 0, stdout: JSON.stringify({ loggedIn }), stderr: '' };
    return { code: 0, stdout: init(skills, plugins), stderr: '' };
  } });
  await assert.rejects(claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', runtime(['lk-learn', 'learner-kit:lk-learn'])), /exactly one installation/u);
  await assert.rejects(claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', runtime([])), /exactly one installation/u);
  await assert.rejects(claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', runtime(['learner-kit:lk-learn'], false)), /Authentication/u);
  const timedOut = which => ({ async execute(args) {
    if (args[0] === '--version') return which === 'version' ? { code: null, stdout: '', stderr: '', reason: 'Claude turn timed out' } : { code: 0, stdout: '1.0.0', stderr: '' };
    return { code: null, stdout: JSON.stringify({ loggedIn: true }), stderr: '', reason: 'Claude turn timed out' };
  } });
  await assert.rejects(claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', timedOut('version')), /timed out/u);
  await assert.rejects(claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', timedOut('auth')), /Authentication preflight: Claude turn timed out/u);
  await assert.rejects(claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', runtime(['learner-kit:lk-learn'], true, [])), /not loaded as a plugin/u);
  await assert.rejects(claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', runtime(['learner-kit:lk-learn'], true, [{ path: root, version: '0.0.0' }])), /differs from source/u);
  const host = await claudePreflight(root, ['lk-learn'], 'learner-kit:', 'sonnet', runtime(['learner-kit:lk-learn']));
  t.after(() => host.cleanup());
  assert.equal(host.installed[0].loaded, 'learner-kit:lk-learn');
});
