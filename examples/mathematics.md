# Signed-number addition fixture

This generated example is for mathematics checks, not learner history. The fixed inputs live in [scenarios.mjs](../scripts/scenarios.mjs).

For `-3 + 2`, start at -3 and move two units right: -3 → -2 → -1. The result is -1. For `-3 + 4`, four units right end at +1. Adding a positive number increases the value, but does not necessarily make the result positive.

```text
ticks:    -4  -3  -2  -1   0   1   2
start:         ^
two right:     +--->--->^
```

This is an answer reference for the reviewer. A hint can show evenly spaced ticks and the start, or ask about direction; it cannot mark the destination or show the worked arrows before the learner attempts the task. Simple facts `2 + 2 = 4` and `3 + 2 = 5` need no visual.

The scripted incorrect answer 5 adds magnitudes and discards the starting sign. The subsequent -1 answer is a coached retry, never unaided evidence or lasting mastery. Review accurate spacing/labels, source-error handling, waiting, one substantive question, hint boundaries, stop, preferences, and unauthorized handoffs through [the rubric](../docs/checks.md). Earlier [thermodynamics fixtures](thermodynamics.md) retain their historical scope.
