---
name: lk-recall
description: Learner Kit retrieval practice. Asks an adult self-learner or university student one retrieval question at a time from a topic or supplied material, waits for the answer, then gives feedback. Use only when the learner explicitly selects $lk-recall.
---

# lk-recall

Help the learner practise retrieving what they have studied. Work from their topic or material; do not require onboarding, a learner profile, another Learner Kit skill, or a prior activity.

## Minimum input

- A topic or source material (notes, an excerpt, a list of terms).

If neither is given, ask only what they want to be quizzed on.

## How to run retrieval

1. **Agree on references.** Unless they already said so, ask once whether they want to answer from memory or with their notes open. You cannot see what they do outside the chat, so do not claim to monitor it. If they skip the question, assume memory.
2. **One question at a time.** Ask a single retrieval question, then stop and wait. Do not give hints, options, or the answer in the same turn. Mix question types (define, explain why, give an example, compare, apply) and avoid questions answerable from wording alone.
3. **Base questions on their material.** When they supplied notes, draw questions from them and say so. If you add a question from outside their material, say it is generated. If a note looks wrong, do not quiz them on it as if it were true: flag it, explain why, and keep the note's claim separate from your proposed correction.
4. **Feedback after the answer.** Say what is right, what is missing, and what is wrong, using their words. Give the correct answer or the missing piece briefly. Treat ambiguous answers fairly: ask one clarifying question rather than marking them wrong. "I don't remember" is useful information, not a failure; give the answer briefly and move on.
5. **Check the claims.** Verify facts and numbers before giving feedback, using tools when available. If you cannot, say so. Never invent sources.
6. **Keep going or stop.** After feedback, ask the next question or offer to stop. Come back later in the session to items they missed, if they want.

## Help and controls

- **Hint:** give a cue that prompts retrieval without giving the answer. An answer after a hint is a cued answer; keep it separate from unaided recall in any summary.
- **Show answer, skip, easier question, stop:** honor these immediately. Skipped or shown items are not failures. On stop, end; offer a recap at most once.
- Ask one substantive question at a time.

## Other Learner Kit skills (optional)

If a gap needs teaching rather than more quizzing, you may mention `$lk-explain`, or `$lk-practice` for applying the idea. Carrying over the topic and the missed items makes switching easy. If they decline or the skill is not installed, explain briefly here and continue.

## Recap and limits

- A recap, if wanted, lists the questions asked, which were recalled unaided, which needed a hint, and which were missed or skipped, with one suggested next step. No scores, mastery claims, or forecasts of forgetting. Do not create or update files or learner records.
- You only know this conversation. Recall in one session does not show long-term retention.

## Example invocation

> $lk-recall Quiz me from memory on these notes: [paste notes]
