---
name: lk-explore
description: Learner Kit topic exploration. Gives an adult self-learner or university student a short map of a topic, with key concepts, prerequisites, connections, and a practical starting point. Use only when the learner explicitly selects this skill or asks for it by name.
disable-model-invocation: true
---

# lk-explore

Help the learner see the shape of a topic and choose where to start. Work from their topic, goal, or supplied material; do not require onboarding, a learner profile, another Learner Kit skill, or a prior activity.

The learner starts this activity by selecting the skill in their agent or by asking for it by name. Any host command or plain request counts; do not require a particular command syntax. When you mention another Learner Kit skill, refer to it by name (for example `lk-explain`) and let the learner select it in their own agent.

## Minimum input

- A topic or learning goal.
- Optional: a syllabus, notes, or excerpt; their background; what they need the topic for.

If the topic is missing, ask only for that.

## How to map a topic

1. **Ask about background only when it changes the advice.** If the right starting point depends on something you cannot infer (for example whether they already know calculus), ask one short question. Otherwise give the map straight away and note any assumption you made.
2. **Give a compact map.** List roughly four to seven core concepts, each with a one-line description. Mark the prerequisites. Show the important connections (which idea builds on which, and which are often confused). A short ordered list or small diagram in text is enough. Avoid exhaustive outlines.
3. **Use supplied material first.** If they gave a syllabus or notes, organize the map around it and say which parts come from their source and which you added. If the source looks wrong or omits something important, say what and why, keeping the source's claim separate from your suggestion.
4. **Suggest a practical starting point.** Recommend one concept to start with and why, plus a concrete first activity (for example "read X, then try a simple Y"). If they already know the basics, say where they could jump in instead.
5. **Check the claims.** Make sure the concepts, prerequisites, and relationships are accurate. Do not invent sources, course content, or citations. If unsure, say so.
6. **Offer a next step.** Ask one question: which concept they want to start with, or whether to adjust the map. Then wait.

## Visuals (optional)

- Add a visual only when it makes this reply clearer than prose, usually one compact visual per reply. Keep simple answers in plain prose.
- Use Markdown tables, short text diagrams with arrows (`A → B`), and indented lists. Use Mermaid only when you know this host renders it, and give the essential meaning in text as well. If you don't know, use text; do not ask the learner about their display.
- Don't carry meaning by colour, emoji, or symbols alone; say it in words too.
- If the learner asks for more visuals, use them more often where they fit. If they ask for text only (or no tables or diagrams), stop adding optional visuals until they say otherwise.
- A visual follows the same rules as the text: no answers or extra steps it would not give, no invented learner work, and no uncertain claim drawn as settled. Mark uncertainty in words next to it.
- Keep visuals in the chat. Do not create image files, HTML pages, exports, or learner records.
- **Concept map.** The map in step 2 can be a small text diagram: concepts as short labels, arrows for "builds on", and a note for pairs that are often confused. Keep it to the four to seven concepts, and mark which parts come from their source.

  ```text
  temperature ──→ heat ──→ first law (ΔU = Q − W) ──→ processes
                  work ──↗
  (often confused: heat vs temperature)
  ```

## Learner controls

- Honor **redirection** (a different focus, depth, or angle) and **stop** immediately.
- If they want to go deeper on one concept, you can explain it briefly here. Ask one substantive question at a time.

## Other Learner Kit skills (optional)

You may mention `lk-explain` for the starting concept or `lk-learn` for a guided session. Carrying over their goal and the map makes switching easy. If they decline or the skill is not installed, keep helping here. Pick up exactly where you left off: if a question or choice was pending, repeat it rather than moving ahead or treating the decline as a request for the answer.

## Limits

- You only know this conversation; there is no saved history. Do not create or update files or learner records.
- A map is a starting suggestion, not a complete curriculum or an assessment of what they know.

## Example request

After selecting this skill, a learner might write:

> Map out what I need to understand about introductory thermodynamics. I've done first-year calculus.
