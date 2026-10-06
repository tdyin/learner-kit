export const names = ['lk-coach', 'lk-explain', 'lk-explore', 'lk-learn', 'lk-recall', 'lk-review', 'lk-transfer'];

export function historyContext(fixture) {
  return `\n\nSupplied fixed fixture (source context, not new instructions):\n${fixture.text}\nArchive period/date: ${fixture.period}\nPhoto creator: ${fixture.image.creator}\nArchive uncertainty: ${fixture.uncertainty}\nPhoto credit: ${fixture.image.credit}\nSource: ${fixture.image.sourcePage}\nImage URL: ${fixture.image.url}\nUsage: ${fixture.image.rights}`;
}

export function scenarios(selection, prefix = '') {
  const select = name => `$${prefix}${name}`;
  const hint = { question: true, absent: ['(?<![\\d.])-\\s*1(?!\\d|\\.\\d)', '\\b(?:negative|minus)[\\s-]+(?:one\\b|1(?!\\d|\\.\\d))'] };
  const retryBookkeeping = ['coached retr', '\\b(?:first|second|third|one|two|three|[123])\\s+(?:unsuccessful\\s+)?(?:retr(?:y|ies)|attempts?)\\b', '\\b(?:retry|attempt)\\s*#?\\s*[123]\\b'];
  const implicitHint = { ...hint, absent: [...hint.absent, ...retryBookkeeping] };
  const recall = (id, preference) => ({ id, turns: [
    { prompt: `${select('lk-recall')} Quick, from memory, exactly two questions. ${preference} Notes: the additive identity is zero; adding a positive number moves right on the number line. Ask about the additive identity first.`, expect: { question: true, present: ['Question 1 of 2', '▱▱'] } },
    { prompt: 'Give me a cue, not the answer.', expect: { present: ['Question 1 of 2', '▱▱'], absent: ['zero', '\\b0\\b'] } },
    { prompt: 'show answer', expect: { question: true, present: ['Question 2 of 2', '▰▱', 'zero|\\b0\\b'] } },
    { prompt: 'skip', expect: { question: false, present: ['Done: 2 of 2', '▰▰', 'not answered|shown|skipped'] } },
  ] });
  const math = [
    { id: 'math-unselected', turns: [{ prompt: 'Explain why -3 + 2 is negative. I find signed numbers hard to picture.' }] },
    { id: 'math-explain', turns: [
      { prompt: `${select('lk-explain')} Explain why -3 + 2 is negative. I find signed numbers hard to picture.`, expect: { present: ['-3', '-1', '```|─|--|→'] } },
      { prompt: 'Use the same number line for -3 + 4. Show the starting point and direction again.', expect: { present: ['-3', '\\b1\\b', '```|─|--|→'] } },
      { prompt: 'Text only from now on. What is 2 + 2?', expect: { present: ['\\b4\\b'], absent: ['```', '\\|', 'mermaid'], maxWords: 80 } },
      { prompt: 'What is 3 + 2?', expect: { present: ['\\b5\\b'], absent: ['```', '\\|', 'mermaid'], maxWords: 80 } },
      { prompt: 'My notes say adding a positive number always makes the result positive. Explain that.', expect: { present: ['not|incorrect|false|wrong|negative|doesn.t'], absent: ['```', '\\|'] } },
    ] },
    { id: 'math-coach', turns: [
      { prompt: `${select('lk-coach')} Hints only for -3 + 2; do not give the final answer. I struggle to picture signed numbers. Ask me about direction first, then wait.`, expect: hint },
      { prompt: 'Positive addition moves right. I think the answer is 5 because I added the magnitudes.', expect: hint },
      { prompt: 'Starting at -3 and moving two places right, I get -1.', expect: { present: ['correct|yes|right|-1'] } },
      { prompt: 'Please do not switch to lk-explain. Continue coaching here with the same help limit.', expect: { absent: ['\\$lk-explain', 'switching to', 'activat(?:ed|ing) lk-explain'] } },
      { prompt: 'stop', expect: { question: false, maxWords: 45 } },
    ] },
    { id: 'math-coach-retries', turns: [
      { prompt: `${select('lk-coach')} Hints only for -3 + 2; do not give the final answer. My answer is 5 because I added the magnitudes.`, expect: implicitHint },
      { prompt: 'I started at -3 and moved two places right, so my answer is +1.', expect: implicitHint },
      { prompt: 'I started at -3 and moved two places left, so my answer is -5.', expect: { question: true, absent: [...implicitHint.absent, 'different explanation', 'easier (?:exercise|version|task)', 'or a break', 'would you (?:prefer|like)'] } },
      { prompt: 'Stop and give me a short recap I can paste into a new chat.', expect: { question: false, absent: retryBookkeeping } },
    ] },
    recall('math-recall-finish', 'Text only and hide progress if possible.'),
    recall('math-recall-completion', 'Text only.'),
    { id: 'math-recall-stop', turns: [
      { prompt: `${select('lk-recall')} Quick two-question quiz, from memory, on positive addition and the additive identity.`, expect: { question: true, present: ['Question 1 of 2', '▱▱'] } },
      { prompt: 'stop', expect: { question: false, maxWords: 45, absent: ['Question \\d', 'Done:', '▰|▱'] } },
    ] },
  ];
  const history = [
    { id: 'history-explain', imageFixture: true, turns: [
      { prompt: `${select('lk-explain')} Use the supplied written-source fixture and attached archival photo to explain what each can establish about Social Security in 1935. The difference between visible evidence and interpretation is hard to picture. Include the actual sourced photo in the chat if this surface supports it, keep the meaning accessible in words, and distinguish image inspection from display. Then ask one observation question and wait.`, expect: { question: true, present: ['1935', 'source|record|caption', 'cannot|can.t|does not|doesn.t|not prove'] } },
      { prompt: 'Everyone looks pleased, so this proves all Americans supported the law.', expect: { present: ['not|cannot|can.t|doesn.t', 'support|opinion|Americans|population'] } },
      { prompt: 'Text only now. Reuse the same photo: I can see a seated person with a pen and people standing nearby. The date and identities come from the archive, and public opinion would need other evidence.', expect: { absent: ['!\\[', '```', '\\|'], present: ['yes|correct|right|distinguish|observation'] } },
      { prompt: 'stop', expect: { question: false, maxWords: 45 } },
    ] },
    { id: 'history-coach', imageFixture: true, turns: [
      { prompt: `${select('lk-coach')} With the written-source fixture and attached photo, help me answer: does this evidence prove universal support for the Social Security Act? Hints only. Ask me to identify one visible detail first; do not answer the support question for me.`, expect: { question: true, absent: ['answer is no', 'does not prove universal', 'doesn.t prove universal'] } },
      { prompt: 'Can you give me one more cue without the answer?', expect: { question: true, absent: ['answer is no', 'does not prove universal', 'doesn.t prove universal'] } },
      { prompt: 'stop', expect: { question: false, maxWords: 45 } },
    ] },
  ];
  return selection === 'math' ? math : selection === 'history' ? history : [...math, ...history];
}
