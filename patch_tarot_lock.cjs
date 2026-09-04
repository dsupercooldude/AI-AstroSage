const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

c = c.replace(
  /const \[selectedMinor, setSelectedMinor\] = useState\(null\);/,
  `const [selectedMinor, setSelectedMinor] = useState(null);
  const [alreadyDrawnToday, setAlreadyDrawnToday] = useState(false);`
);

c = c.replace(
  /if \(logDate === today && lastLog\.cards && lastLog\.cards\.length === 2\) \{/,
  `if (logDate === today && lastLog.cards && lastLog.cards.length === 2) {
                setAlreadyDrawnToday(true);`
);

c = c.replace(
  /disabled=\{!selectedMajor \|\| !selectedMinor \|\| isDrawing\}/g,
  `disabled={!selectedMajor || !selectedMinor || isDrawing || alreadyDrawnToday}`
);

c = c.replace(
  /\{isDrawing \? 'Channeling Oracle\.\.\.' : 'Read My Cards'\}/,
  `{alreadyDrawnToday ? 'Daily Oracle Locked (Returns at Midnight)' : isDrawing ? 'Channeling Oracle...' : 'Read My Cards'}`
);

c = c.replace(
  /onClick=\{\(\) => drawRandom\(deckMajor, setSelectedMajor\)\}/,
  `onClick={() => !alreadyDrawnToday && drawRandom(deckMajor, setSelectedMajor)}`
);

c = c.replace(
  /onClick=\{\(\) => drawRandom\(deckMinor, setSelectedMinor\)\}/,
  `onClick={() => !alreadyDrawnToday && drawRandom(deckMinor, setSelectedMinor)}`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
