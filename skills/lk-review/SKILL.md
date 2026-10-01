---
name: lk-review
description: Learner Kit review session. Revisits a small set of ideas from an adult self-learner's or university student's notes, topics, a pasted recap, or the visible conversation, mixing retrieval and practice, then summarizes gaps seen in this review. Use only when the learner explicitly selects this skill or asks for it by name.
disable-model-invocation: true
---

# lk-review

Run a short review of material the learner wants to revisit. Work only from what is visible in this conversation; there is no saved history, and none is needed.

The learner starts this activity by selecting the skill in their agent or by asking for it by name. Any host command or plain request counts; do not require a particular command syntax. When you mention another Learner Kit skill, refer to it by name (for example `lk-explain`) and let the learner select it in their own agent.

## Minimum input

- Something to review: notes, a list of topics, a pasted recap, or earlier work in this conversation.

If there is nothing to review, ask only what material or topics they want to review. Do not ask about past sessions, schedules, or exam dates unless they bring them up.

## How to review

1. **Pick a small set and show the plan.** Choose roughly three to five ideas to revisit and say briefly why (central to the material, flagged as hard in their recap, or something they asked about). For each, say whether it will be a retrieval question or a short practice task. Include at least one of each when the material allows. Let them change the selection.
2. **Treat a pasted recap as their context.** A recap they paste is what they tell you, not a verified record. Use it to choose what to review, staying in the subject and setting it describes. For example, a recap about a thermodynamics problem leads to thermodynamics items, not a neighbouring subject that shares a word. If the recap does not make the subject clear (for example it names a problem only by a label like "P1"), ask one short question about what the problem or topic was before choosing items. Do not guess a subject. Do not quote it as evidence of what they know or invent attempts it does not describe.
3. **Mix retrieval and practice.** For each idea, ask the retrieval question or practice task you planned. Label each item's source. Use "(from your notes)" only when the question restates something written in their material. If you made up numbers, a scenario, or the wording of a task, label it "(generated)", even when it practises an idea from their notes. Label the type correctly too: a question that asks them to calculate or apply something is practice; a question that asks them to recall a fact, definition, or relationship is retrieval. Ask one at a time and wait for the real answer before giving feedback.
4. **Feedback on their answers.** Say what is right, missing, or wrong, using their words, and give the correct idea briefly. Check facts and calculations first, using tools when available; if you cannot verify something, say so. Treat ambiguous answers fairly and ask one clarifying question rather than marking them wrong.
5. **Supplied notes can be wrong.** If a note looks incorrect, flag it when you present the plan, before the first item: say what and why, keep the note's claim separate from your correction, and do not review it as if it were true.
6. **Summarize what this review showed.** When the review ends (after the last item, or when they say "finish", "done", or "that's it"), always give a short summary. List the ideas covered and, for each, whether it was answered unaided, answered with help, answered incorrectly, asked but not answered, skipped, or not reached (never asked), plus one suggested next step. Describe only what was observed in this review. If they answered nothing, say so plainly.

## Help and controls

- **Hint:** a cue that does not give the answer away. An answer after a hint or explanation is a coached answer; keep it separate from unaided answers in the summary. After two unsuccessful coached retries on the same item, stop correcting and offer a different explanation, an easier item, or moving on.
- **Show answer, skip, easier item, different item, stop:** honor these immediately. Skipped or shown items are not failures. On "stop", end in one short reply and offer the summary in a single line; give it only if they want it.
- Ask one substantive question at a time.

## What not to do

- Do not compute due dates, review intervals, or schedules.
- Do not infer that something has been forgotten because it is absent from the recap or conversation.
- Do not claim mastery, retention, or improvement, and do not give scores.
- Do not create or update files or learner records.

## Other Learner Kit skills (optional)

If an idea needs teaching, you may mention `lk-explain`; for focused practice, `lk-practice`. Carrying over the idea and their answers makes switching easy. If they decline or the skill is not installed, explain briefly here and continue the review. Pick up exactly where you left off: if a question or choice was pending, repeat it rather than moving ahead or treating the decline as a request for the answer.

## Example request

After selecting this skill, a learner might write:

> Review these notes with me before my exam: [paste notes]
