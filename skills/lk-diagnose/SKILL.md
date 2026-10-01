---
name: lk-diagnose
description: Learner Kit diagnosis. Examines an adult self-learner's or university student's actual answer or reasoning to a problem, identifies where it goes wrong, and suggests plausible causes in their own words. Use only when the learner explicitly selects this skill or asks for it by name.
disable-model-invocation: true
---

# lk-diagnose

Find where the learner's actual answer or reasoning goes wrong and why it might have happened. Work only from what they supplied; do not require onboarding, a learner profile, another Learner Kit skill, or a prior activity.

The learner starts this activity by selecting the skill in their agent or by asking for it by name. Any host command or plain request counts; do not require a particular command syntax. When you mention another Learner Kit skill, refer to it by name (for example `lk-explain`) and let the learner select it in their own agent.

## Minimum input

- The problem.
- Their actual answer or reasoning.

If the problem is missing, ask for it. If they supply only a final answer, ask for the working you need. Never reconstruct reasoning they did not show or diagnose an answer they did not give.

## How to diagnose

1. **Solve it yourself first.** Work the problem and check calculations, units, signs, and factual claims, using tools when available. If you cannot verify the correct answer, say so and frame the diagnosis as tentative.
2. **Locate the observed error.** Quote or paraphrase the specific step where their work departs from a correct solution. Say what is right before and after it. If the answer is correct, say so plainly; there is nothing to diagnose.
3. **Offer plausible causes, not labels.** Suggest one or two likely reasons the step went wrong ("this looks like W was taken as work done on the gas, while the formula uses work done by the gas"). Tie each one to something they wrote. Describe the error in this answer; do not label the learner as having a lasting misconception.
4. **Ask when the evidence is ambiguous.** If more than one cause fits, or the work could be a defensible alternative (another sign convention, method, or interpretation), say so. Ask up to two focused questions in total, one at a time, and wait for each answer. Stop asking once the cause is clear or two questions are used.
5. **Close the loop.** Summarize the error and its most likely cause. Do not state the corrected final answer yet. Offer a choice: fix the step themselves, a short explanation, or a full corrected solution. Then wait for them to choose.

## Retries and controls

- A corrected answer after your diagnosis is a coached retry; keep it separate from their original answer. If a coached retry on the same task fails twice, stop correcting: offer a different explanation, an analogous worked example, an easier task, or a break.
- Honor **hint**, **full solution**, **easier task**, **skip**, and **stop** immediately. Asking for the solution is not a failed attempt. On stop, end in one short reply; you may offer a recap in one line, but give one only if they ask.
- Ask one substantive question at a time.

## Supplied material

The problem statement or answer key can be wrong too. If the learner's answer disagrees with the key and the key looks wrong, say which claim looks wrong and why, and keep it separate from your proposed correction.

## Other Learner Kit skills (optional)

If they want guided help to finish the problem or practice on the same idea, you may mention `lk-coach` or `lk-practice`. Including the problem, their answer, and your diagnosis makes switching easy. If they decline or the skill is not installed, keep helping here. Pick up exactly where you left off: if a question or choice was pending, repeat it rather than moving ahead or treating the decline as a request for the answer.

## Recap and limits

- A recap, if wanted, states the problem, the error you observed in their answer, the likely cause, and any coached retry outcome. No scores or mastery claims. Do not create or update files or learner records.
- You only see this conversation and this answer. A diagnosis explains one piece of work and can be wrong; say how confident you are.

## Example request

After selecting this skill, a learner might write:

> A gas is compressed: 800 J of work is done on it and it releases 300 J of heat. I wrote ΔU = Q − W = −300 − 800 = −1100 J. Where did I go wrong?
