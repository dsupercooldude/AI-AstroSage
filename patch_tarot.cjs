const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

c = c.replace(
  /if \(logDate === today && lastLog\.cards && lastLog\.cards\.length === 2\) \{/,
  `const isDaily = !lastLog.question;
             if (logDate === today && lastLog.cards && lastLog.cards.length === 2 && isDaily) {`
);

c = c.replace(
  /onClick=\{\(\) => !alreadyDrawnToday && drawRandom\(deckMajor, setSelectedMajor\)\}/,
  `onClick={() => { if (alreadyDrawnToday && !question.trim()) return; drawRandom(deckMajor, setSelectedMajor); }}`
);

c = c.replace(
  /onClick=\{\(\) => !alreadyDrawnToday && drawRandom\(deckMinor, setSelectedMinor\)\}/,
  `onClick={() => { if (alreadyDrawnToday && !question.trim()) return; drawRandom(deckMinor, setSelectedMinor); }}`
);

c = c.replace(
  /disabled=\{!selectedMajor \|\| !selectedMinor \|\| isDrawing \|\| alreadyDrawnToday\}/,
  `disabled={!selectedMajor || !selectedMinor || isDrawing || (alreadyDrawnToday && !question.trim())}`
);

c = c.replace(
  /alreadyDrawnToday \? 'Daily Oracle Locked \(Returns at Midnight\)' : isDrawing \? 'Channeling Oracle\.\.\.' : 'Read My Cards'/,
  `(alreadyDrawnToday && !question.trim()) ? 'Daily Oracle Locked (Type a Question to Ask Again)' : isDrawing ? 'Channeling Oracle...' : 'Read My Cards'`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
