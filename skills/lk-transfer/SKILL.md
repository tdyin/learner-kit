---
name: lk-transfer
description: Learner Kit transfer practice. Takes a method, worked example, or concept an adult self-learner or university student already knows and poses a task with one meaningful change of context, representation, or assumption, then discusses what carries over. Use only when the learner explicitly selects $lk-transfer.
---

# lk-transfer

Help the learner find out which parts of a familiar method still work when something important changes. Work from what they supplied; do not require onboarding, a learner profile, another Learner Kit skill, or a prior activity.

## Minimum input

- A source example: a worked problem, a method, or a concept they are familiar with.

If none is given, ask for one, or offer a short, simple source example on their topic and confirm they know it before you change it. Label any example you generate.

## How to run transfer

1. **Name the source.** Restate the source example and the method in one or two lines so you both start from the same place.
2. **Change one meaningful thing.** Pose a new task that keeps most of the setup but changes one aspect that matters for the method:
   - context (a different physical system, field, or application);
   - representation (a graph, table, diagram, or words instead of an equation);
   - an assumption (reversible → irreversible, constant → varying, ideal → non-ideal).
   Avoid changes that only swap numbers. Check that the new task is well-posed before you present it: the givens are consistent, and the stated process and final state are physically possible (for example a gas pushing against an external pressure lower than its final pressure needs a stop to end at the stated volume). Say what the success standard is, but do not say what changes in the method, because spotting that is the point.
3. **Invite an actual attempt.** Ask them to try it and wait. Do not hint or solve in the same turn. Treat their first answer as an unaided transfer attempt.
4. **Feedback on their attempt.** Check calculations, units, signs, and claims, using tools when available. Say what they carried over correctly and what they missed, in their own terms. Accept defensible alternative approaches.
5. **Discuss what carries over and what changes.** After the attempt (or a solution request), discuss explicitly which parts of the method still hold, which do not, and why. Ask one question to have them articulate it, if they want.
6. **Next step.** Offer another variation (changing a different aspect), help on this one, or stopping. Ask one question and wait.

## Help, retries, and controls

- **Hint:** move them one step without revealing the full approach. An answer after help is a coached retry; keep it separate from the unaided attempt. After two unsuccessful coached retries on the same task, stop correcting and offer a different explanation, an analogous worked example, an easier variation, or a break.
- **Full solution, easier variation, skip, stop:** honor these immediately. Asking for the solution is not a failed attempt. On stop, end in one short reply; you may offer a recap in one line, but give one only if they ask.
- Ask one substantive question at a time.

## Supplied material

If the source example contains an error, say which step looks wrong and why, keep it separate from your correction, and agree on the corrected source before you build a variation on it.

## Other Learner Kit skills (optional)

If the source method itself is shaky, you may mention `$lk-explain` or `$lk-coach`. Carrying over the source example and their attempt makes switching easy. If they decline or the skill is not installed, keep helping here. Pick up exactly where you left off: if a question or choice was pending, repeat it rather than moving ahead or treating the decline as a request for the answer.

## Recap and limits

- A recap, if wanted, gives the source example, the change, what they did unaided, what help they needed, and what carried over. No mastery claims. Do not create or update files or learner records.
- You only know this conversation. Success on one variation does not show they can transfer the method in general.

## Example invocation

> $lk-transfer I know how to get W for a reversible isothermal ideal-gas expansion. Help me apply this energy-balance method to a different situation.
