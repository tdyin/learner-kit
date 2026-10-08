import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { names, scenarios } from './scenarios.mjs';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function validate(directory = root) {
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const read = path => readFile(join(directory, path), 'utf8');
  try {
    const folders = (await readdir(join(directory, 'skills'))).sort();
    check(JSON.stringify(folders) === JSON.stringify([...names].sort()), 'Expected exactly the four standalone skill folders');
    for (const name of names) {
      const skill = await read(`skills/${name}/SKILL.md`);
      const front = skill.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/u)?.[1];
      check(Boolean(front), `${name}: missing frontmatter`);
      const lines = (front ?? '').split(/\r?\n/u);
      const fields = Object.fromEntries(lines.map(line => { const colon = line.indexOf(':'); return [line.slice(0, colon), line.slice(colon + 1).trim()]; }));
      check(lines.length === 3 && Object.keys(fields).length === 3 && Object.keys(fields).every(key => ['name', 'description', 'disable-model-invocation'].includes(key)), `${name}: unexpected or duplicate frontmatter fields`);
      check(fields.name === name && /^[a-z0-9-]{1,64}$/u.test(name), `${name}: invalid name`);
      check(Boolean(fields.description) && fields.description.length <= 1024 && !fields.description.includes(': '), `${name}: invalid plain description`);
      check(fields['disable-model-invocation'] === 'true', `${name}: Claude Code/Pi explicit-only control missing`);
      // Anthropic skill-authoring best practices: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
      const description = fields.description ?? '';
      check(!/[<>]/u.test(`${fields.name}${description}`), `${name}: name/description must not contain XML tags`);
      check(!/anthropic|claude/iu.test(fields.name ?? ''), `${name}: name must not contain a reserved word`);
      check(!/\b(?:I|me|my|we|us|our|you|your)\b/iu.test(description), `${name}: description must be third person`);
      check(/\bUse (?:only )?when\b/u.test(description), `${name}: description must say when to use the skill`);
      const body = skill.slice(skill.indexOf('\n---', 3) + 4).replace(/^\r?\n/u, '').replace(/\r?\n$/u, '');
      check(body.split(/\r?\n/u).length < 500, `${name}: SKILL.md body must stay under 500 lines`);
      check(!/\]\([^)\s]*\\/u.test(skill), `${name}: file references must use forward slashes`);
      for (const match of skill.matchAll(/\]\(([^)\s#]+\.md)(?:#[^)\s]*)?(?:\s+"[^"]*")?\)/gu)) {
        if (/^[a-z][a-z0-9+.-]*:/iu.test(match[1])) continue;
        const nested = await read(`skills/${name}/${match[1]}`).catch(() => '');
        check(!/\]\((?![a-z][a-z0-9+.-]*:)[^)\s#]+\.md/iu.test(nested), `${name}: ${match[1]} must not link to further reference files (keep references one level deep)`);
      }
      const yaml = (await read(`skills/${name}/agents/openai.yaml`)).replace(/\r\n/gu, '\n');
      check(/^interface:\n(?:  (?:display_name|short_description|default_prompt): "[^"\n]+"\n){3}\npolicy:\n  allow_implicit_invocation: false\n?$/u.test(yaml), `${name}: unsupported or invalid Codex metadata/configuration`);
      const keys = [...yaml.matchAll(/^  ([a-z_]+):/gmu)].map(match => match[1]);
      check(new Set(keys).size === 4, `${name}: duplicate Codex metadata field`);
      check(yaml.includes(`Use $${name}`), `${name}: selection prompt names a different skill`);
    }
    for (const path of ['README.md', 'LICENSE', 'docs/checks.md', 'examples/mathematics.md']) await read(path);
    const manifest = JSON.parse(await read('plugin.json'));
    const claude = JSON.parse(await read('.claude-plugin/plugin.json'));
    const openaiCatalog = JSON.parse(await read('.agents/plugins/marketplace.json'));
    const claudeCatalog = JSON.parse(await read('.claude-plugin/marketplace.json'));
    check(manifest.name === 'learner-kit' && /^\d+\.\d+\.\d+$/u.test(manifest.version), 'Invalid plugin name/version');
    check(manifest.version === claude.version && manifest.version === claudeCatalog.plugins?.[0]?.version, 'Host manifest/catalog version mismatch');
    check(manifest.name === claude.name && claudeCatalog.plugins?.length === 1 && claudeCatalog.plugins[0].name === manifest.name && claudeCatalog.plugins[0].source === './', 'Claude catalog must reference the shared root package');
    const entry = openaiCatalog.plugins?.[0];
    check(openaiCatalog.name === claudeCatalog.name && openaiCatalog.plugins?.length === 1 && entry?.name === manifest.name && entry?.source?.source === 'local' && entry?.source?.path === './', 'OpenAI catalog must reference the shared root package');
    check(entry?.policy?.installation === 'AVAILABLE' && entry?.policy?.authentication === 'ON_INSTALL' && entry?.category === 'Productivity', 'Invalid OpenAI catalog policy');
    const history = JSON.parse(await read('examples/history/fixture.json'));
    check(/^https:\/\//u.test(history.image.url) && /^[a-f0-9]{64}$/u.test(history.image.sha256), 'Invalid history URL/hash');
    check(history.image.cache === '.local/checks/fixtures/social-security-signing.jpg', 'History cache must stay in generated outputs');
    await read(history.writtenSource);
    for (const scenario of scenarios('both')) {
      check(scenario.turns.length > 0 && scenario.turns.length <= 8, `${scenario.id}: invalid turn bound`);
      for (const turn of scenario.turns) {
        check(Boolean(turn.prompt), `${scenario.id}: missing fixed prompt`);
        for (const pattern of [...(turn.expect?.present ?? []), ...(turn.expect?.absent ?? [])]) new RegExp(pattern, 'iu');
      }
    }
    const visit = async folder => {
      for (const entry of await readdir(join(directory, folder), { withFileTypes: true })) {
        const path = join(folder, entry.name);
        if (['docs/results', 'docs/smoke-checks.md', 'docs/release-acceptance.md'].includes(path.replaceAll('\\', '/'))) continue;
        if (entry.isDirectory()) await visit(path);
        else if (entry.name.endsWith('.md')) {
          for (const match of (await read(path)).matchAll(/!?\[[^\]\n]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/gu)) {
            const target = match[1].split('#')[0];
            if (!target || /^[a-z][a-z0-9+.-]*:/iu.test(target)) continue;
            try { await stat(resolve(directory, dirname(path), decodeURIComponent(target))); }
            catch { failures.push(`${path}: missing local link ${target}`); }
          }
        }
      }
    };
    for (const folder of ['docs', 'examples', 'skills']) await visit(folder);
    for (const file of ['README.md', 'AGENTS.md']) {
      for (const match of (await read(file)).matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/gu)) {
        const target = match[1].split('#')[0];
        if (!target || /^[a-z][a-z0-9+.-]*:/iu.test(target)) continue;
        try { await stat(resolve(directory, target)); } catch { failures.push(`${file}: missing local link ${target}`); }
      }
    }
  } catch (error) { failures.push(error.message); }
  return { status: failures.length ? 'fail' : 'pass', discoveredFromSource: names.length, failures, limits: 'Checks the supported repository YAML subset and local file links; not runtime discovery, full external schemas, link anchors, or permission behavior.' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await validate();
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.status === 'pass' ? 0 : 1;
}
