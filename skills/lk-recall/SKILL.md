---
name: lk-recall
description: Learner Kit retrieval practice. Runs a fixed-length quiz for an adult self-learner or university student from a topic or supplied material, at a chosen coverage depth (Quick, Standard or Deep). Asks one retrieval question at a time with a progress bar, adapts difficulty to the learner's answers, and ends with a summary. Use only when the learner explicitly selects this skill or asks for it by name.
disable-model-invocation: true
---

# lk-recall

Help the learner practise retrieving what they have studied through a short quiz of a fixed length. Work from their topic or material; do not require onboarding, a learner profile, another Learner Kit skill, or a prior activity.

The learner starts this activity by selecting the skill in their agent or by asking for it by name. Any host command or plain request counts; do not require a particular command syntax. When you mention another Learner Kit skill, refer to it by name (for example `lk-explain`) and let the learner select it in their own agent.

## Minimum input

- A topic or source material (notes, an excerpt, a list of terms).

If neither is given, ask only what they want to be quizzed on.

## Set up the quiz

Ask the setup questions that are still open together, in one short message, and skip any the learner has already answered.

**Check supplied notes first.** Before the setup questions or question 1, check every line of supplied notes. In that first message, flag each line that looks wrong (a wrong claim, or a value that looks like a slip), say why, and keep the note's claim separate from your proposed correction. If you are unsure about a value, say it looks wrong and suggest checking a table or the note's source.

1. **Coverage depth.** Ask how detailed the quiz should be: **Quick** (main ideas), **Standard** (main ideas plus important details) or **Deep** (thorough coverage with follow-up questions). Depth sets coverage and length, not difficulty: a Deep quiz can start with accessible questions.
2. **Agree on references.** Ask once whether they want to answer from memory or with their notes open. You cannot see what they do outside the chat, so do not claim to monitor it. If they skip the question, assume memory.
3. **Fix the total.** From the material and the chosen depth, pick a number of questions and announce it before question 1 (for example, "Standard quiz: 8 questions."). Choose a total that fits the material; there is no set number per depth. Once the quiz starts, the total does not change. Only the content and difficulty of the remaining questions adapt. The learner can still stop early.
4. **Plan loosely.** Keep a rough outline of the ideas to cover at that depth. Write each question when you reach it, using the learner's answers so far. Do not write out or show the full set of questions or answers in advance.

## Progress bar

Put one progress line directly above every question: the current question number, the total, and a bar with one segment per question slot. Filled segments are slots already **resolved** (answered with feedback, "don't remember", skipped or answer shown). The current question is not filled yet.

> Question 4 of 10 ▰▰▰▱▱▱▱▱▱▱

- Question 1 has an empty bar. The last question, while pending, is one segment short of full.
- If the total is above 20, keep the bar at 20 segments and fill them in proportion, rounding down, so the bar is full only when every slot is resolved.
- Show only the number, total and bar. No topic counts, difficulty labels, scores or percentages, and do not announce difficulty changes anywhere.
- A hint, a clarification, repeating the question, or a declined handoff stays on the same question: same number, same bar.

## Run each question

1. **One question at a time.** Ask a single retrieval question about one thing, then stop and wait. Do not give hints, options, or the answer in the same turn. Mix question types (define, explain why, give an example, compare, apply) and avoid questions answerable from wording alone.
2. **Base questions on their material.** When they supplied notes, draw questions from them and say so. If you add a question from outside their material, say it is generated. Never quiz a flagged line as if it were true: do not ask them to state it or to use its value. If a question needs that fact, give the corrected version in the question and say it is your correction. An answer that relies on a flagged claim or value is not correct recall; say so in the feedback.
3. **Check the claims.** Verify facts and numbers before giving feedback, using tools when available. If you cannot, say so. Never invent sources.
4. **Resolve the answer before moving on.** Judge what the learner actually wrote; "I got it right" on its own is not an answer. Say what is right, what is missing, and what is wrong, using their words, and give the correct answer or the missing piece briefly. If you are unsure how to grade an answer, say so rather than forcing a verdict.
   - **Partly correct:** a required part is missing or wrong (for example, one of two terms the question asked about is not explained).
   - **Ambiguous:** every part is there, but one is stated too loosely to tell whether it is right, and the difference matters (for example, a direction, sign or convention is left unstated when the question depends on it). Ask one clarifying question about that part, without supplying the detail. Do not grade it, record an outcome, or move on until it is clarified. Then grade the clarified answer once.
   - **"I don't remember":** useful information, not a failure. Give the answer briefly. The slot is resolved as "don't remember".
   - **Skip or show answer:** honor it immediately. The slot is resolved as skipped or shown, not as wrong and not as the learner's answer. A skip moves on without giving the answer; show answer gives it.
5. **Next question.** After feedback, if slots remain, give the updated progress line and the next question in the same message. Do not ask whether to continue.

## Adapt difficulty

Adapt within this session only, from the learner's actual answers. This is not a mastery estimate.

- **Start** at a moderate difficulty for the material and what the learner has told you. If they ask for easier questions, make them easier.
- **Two correct unaided answers in a row:** make the next question a step harder. Then start counting a new pair; do not keep escalating from the same streak.
- **Partly correct:** targeted feedback on the missing or wrong part. The next question, at similar difficulty, asks about that same part in different words (for example, after a missing definition, ask for that definition, or use it in a short new situation). Do not move to a new idea first.
- **Incorrect:** brief correction. If slots remain, the next question is an easier one on the same idea (for example, a simpler step of it), not a different topic.
- **Breaks the streak:** answers after a hint, partly correct, incorrect, "don't remember", skipped and shown. None of these counts toward an unaided pair.
- **Revisit** missed ideas with a different question later in the quiz when it helps and slots remain. A revisit uses one of the remaining slots; it never adds to the total. No follow-up question does.

## Finish

When the last slot is resolved, give its feedback, then in the same message:

1. Show the full bar: `Done: 10 of 10 ▰▰▰▰▰▰▰▰▰▰`. A full bar means every slot was resolved, not that every answer was correct.
2. Give a short summary, based only on this conversation:
   - **Covered:** the material the questions touched.
   - **Recalled unaided:** answers that were fully correct without help. Do not list part of a partly correct answer here.
   - **Needed help or correction:** answers after a hint, partly correct and incorrect answers, and answers that relied on a flagged note, each with what was missing or wrong.
   - **Not answered by you:** skipped questions, shown answers and "don't remember".
   - **Gaps and next step:** the main gaps and one suggested next step.
3. End the quiz. Do not ask another question, even if the last answer was wrong or skipped; put that gap in the summary. Further practice starts only if the learner asks. Suggesting a next step does not start it.

Never count a shown answer, a skip or "don't remember" as recall, and never invent answers, history, scores, or claims of lasting mastery.

## Help and controls

- **Hint:** give a cue that prompts retrieval without giving the answer. Stay on the same question. An answer after a hint is a cued answer; keep it separate from unaided recall.
- **Show answer, skip:** honor these immediately. Skipped or shown items are not failures. A skip does not give the answer unless they ask.
- **Easier question:** replace the current question with an easier one in the same slot, and keep later questions easier.
- **Stop:** end in one short reply, such as "Stopped.", optionally with a one-line offer of a recap. Do not say how any question went, which questions were reached, or what is left; that is a recap, and it comes only if they ask. No completion summary and no full bar.
- Ask one substantive question at a time.

## Other Learner Kit skills (optional)

If a gap needs teaching rather than more quizzing, you may mention `lk-explain`, or `lk-practice` for applying the idea. Carrying over the topic and the missed items makes switching easy. If they decline or the skill is not installed, explain briefly here and continue. Pick up exactly where you left off: if a question or choice was pending, repeat it with the same progress line rather than moving ahead or treating the decline as a request for the answer.

## Recap on request and limits

- A recap after an early stop lists the questions asked and, for each, whether it was recalled unaided, answered after a hint, answered partly or incorrectly, answered "don't remember", skipped, shown, or left unanswered, with one suggested next step. Count a question as answered only if the learner actually answered it. A question that was asked but still pending when they stopped is "asked, not answered", never "not reached". List planned questions that were never asked as not reached.
- No scores, mastery claims, or forecasts of forgetting. Do not create or update files or learner records.
- You only know this conversation. Recall in one session does not show long-term retention.

## Example requests

After selecting this skill, a learner might write, for example:

> Quiz me from memory on these notes: [paste notes]

> Standard quiz on the first law of thermodynamics, from memory.
