import { readdir, readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

// Inspect only the exact synthetic thread created by this runner, never arbitrary learner history.
export async function inspectActivation(thread, expected, turns, sessionRoot = join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'sessions')) {
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/iu.test(thread)) return { status: 'unverified', observation: 'No valid synthetic thread ID' };
  const time = new Date(parseInt(thread.replaceAll('-', '').slice(0, 12), 16));
  const folder = join(sessionRoot, String(time.getFullYear()), String(time.getMonth() + 1).padStart(2, '0'), String(time.getDate()).padStart(2, '0'));
  try {
    const files = (await readdir(folder)).filter(name => name.endsWith(`${thread}.jsonl`));
    if (files.length !== 1) return { status: 'unverified', observation: 'Exact synthetic history file unavailable or ambiguous' };
    const records = (await readFile(join(folder, files[0]), 'utf8')).trim().split(/\r?\n/u).map(line => JSON.parse(line));
    const completed = records.filter(record => record.type === 'event_msg' && record.payload?.type === 'task_complete').length;
    if (completed < turns) return { status: 'unverified', observation: 'History is incomplete; cannot establish activation' };
    const messages = records.filter(record => record.type === 'response_item' && record.payload?.type === 'message' && record.payload.content?.some(part => typeof part.text === 'string'));
    if (!messages.some(record => record.payload.role === 'user') || !messages.some(record => record.payload.role === 'assistant')) return { status: 'unverified', observation: 'Recognized user/assistant history unavailable; cannot establish activation' };
    const loaded = new Set();
    for (const record of records) {
      if (record.type !== 'response_item') continue;
      for (const part of record.payload.content ?? []) {
        for (const match of (part.text ?? '').matchAll(/<skill>\s*<name>((?:learner-kit:)?lk-[a-z]+)<\/name>/gu)) loaded.add(match[1]);
      }
      if (['function_call', 'custom_tool_call'].includes(record.payload.type)) {
        const invocation = JSON.stringify(record.payload).replaceAll('\\', '/');
        for (const match of invocation.matchAll(/skills\/+((?:lk-)[a-z]+)\/+SKILL\.md/gu)) loaded.add(expected?.endsWith(match[1]) ? expected : match[1]);
      }
    }
    const unexpected = [...loaded].filter(name => name !== expected);
    const pass = unexpected.length === 0 && (!expected || loaded.has(expected));
    return { status: pass ? 'pass' : 'fail', loaded: [...loaded], completedTurns: completed,
      observation: pass ? 'Complete synthetic history: expected skill injection/read observed, or no tutoring skill activation in unselected chat.' : `Expected ${expected ?? 'no tutoring skill'}; observed ${[...loaded].join(', ') || 'none'}`,
      limits: 'Scoped to this Codex history format and exact synthetic thread; not desktop behavior.' };
  } catch (error) { return { status: 'unverified', observation: `Synthetic history inspection unavailable: ${error.message}` }; }
}
