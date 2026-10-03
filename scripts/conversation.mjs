import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// These are observable checks, not a judge of teaching quality.
export function checkReply(text, expected = {}) {
  const failures = [];
  if (!text?.trim()) return ['No assistant reply'];
  const comparable = text.replaceAll('−', '-');
  for (const pattern of expected.present ?? []) {
    if (!new RegExp(pattern, 'iu').test(comparable)) failures.push(`Missing expected cue: ${pattern}`);
  }
  for (const pattern of expected.absent ?? []) {
    if (new RegExp(pattern, 'iu').test(comparable)) failures.push(`Forbidden cue: ${pattern}`);
  }
  if (expected.question === true && !text.includes('?')) failures.push('Expected a pending question');
  if (expected.question === false && text.includes('?')) failures.push('Unexpected question');
  if (expected.maxWords && text.trim().split(/\s+/u).length > expected.maxWords) failures.push('Reply exceeds word bound');
  return failures;
}

export async function runScenario(scenario, adapter, output) {
  const transcript = { scenario: scenario.id, synthetic: true, turns: [] };
  const result = {
    scenario: scenario.id, status: 'pass', observation: 'Objective checks passed; qualitative review remains unverified.',
    qualitative: 'unverified', imageInspection: 'unverified', desktopRendering: 'unverified',
  };
  for (const [index, turn] of scenario.turns.entries()) {
    try {
      const reply = await adapter.turn(turn.prompt, { image: index === 0 ? scenario.image : undefined });
      const failures = checkReply(reply.text, turn.expect);
      transcript.turns.push({ inputKind: 'synthetic learner input', prompt: turn.prompt, reply, failures });
      if (failures.length) {
        result.status = 'fail';
        result.observation = `Turn ${index + 1} diverged: ${failures.join('; ')}. Remaining synthetic inputs were not sent.`;
        break;
      }
    } catch (error) {
      result.status = error.blocked ? 'blocked' : 'fail';
      result.observation = `Turn ${index + 1}: ${error.message}. Remaining inputs were not sent.`;
      break;
    }
  }
  await writeFile(join(output, `${scenario.id}.json`), JSON.stringify(transcript, null, 2) + '\n');
  return result;
}
