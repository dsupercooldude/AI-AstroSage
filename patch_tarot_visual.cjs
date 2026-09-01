const fs = require('fs');
let tarot = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

// The getReading function prompt should be extremely specific to the question.
const newRead = `
      const q = question.trim() || "What do I need to know right now?";
      const prompt = \`User Question: "\${q}". 
Major Arcana Drawn: "\${selectedMajor.name}" (\${selectedMajor.reversed ? 'Reversed' : 'Upright'})
Minor Arcana Drawn: "\${selectedMinor.name}" (\${selectedMinor.reversed ? 'Reversed' : 'Upright'})
Instructions: Provide a deep, poetic, yet highly practical Tarot reading specifically addressing the User Question combining these archetypes. Do NOT give generic advice. Relate the cards directly to their query.\`;
`;
tarot = tarot.replace(/const q = question\.trim\(\)(.|\n)*?paragraphs Tarot reading combining these archetypes\.`;/, newRead);

// The drawing visual: Instead of a single draw button, let's show a scrollable fan of face-down cards to pick from.
const visualDrawMajor = `
            {!selectedMajor ? (
              <div className="w-full flex-1 overflow-x-auto pb-4 custom-scrollbar flex items-center gap-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase mr-4 shrink-0 rotate-180" style={{ writingMode: 'vertical-rl' }}>Select Major</span>
                {deckMajor.slice(0, 22).map((_, i) => (
                  <div 
                    key={i}
                    onClick={() => drawRandom(deckMajor, setSelectedMajor)}
                    className="w-16 h-24 shrink-0 rounded border border-indigo-500/40 bg-gradient-to-br from-indigo-900/80 to-black cursor-pointer hover:-translate-y-2 transition shadow-lg flex items-center justify-center relative group"
                  >
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiM0ZjQ2ZTUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50"></div>
                  </div>
                ))}
              </div>
            ) : (
`;
tarot = tarot.replace(/\{\!selectedMajor \? \(\s*<div\s*className="w-32 h-48[^>]+>\s*<div[^>]+><\/div>\s*<Icon[^>]+><\/Icon>\s*<span[^>]+>Draw<\/span>\s*<\/div>\s*\) : \(/, visualDrawMajor);

const visualDrawMinor = `
            {!selectedMinor ? (
              <div className="w-full flex-1 overflow-x-auto pb-4 custom-scrollbar flex items-center gap-2">
                <span className="text-[10px] font-mono text-pink-400 uppercase mr-4 shrink-0 rotate-180" style={{ writingMode: 'vertical-rl' }}>Select Minor</span>
                {deckMinor.slice(0, 56).map((_, i) => (
                  <div 
                    key={i}
                    onClick={() => drawRandom(deckMinor, setSelectedMinor)}
                    className="w-16 h-24 shrink-0 rounded border border-pink-500/40 bg-gradient-to-br from-pink-900/80 to-black cursor-pointer hover:-translate-y-2 transition shadow-lg flex items-center justify-center relative group"
                  >
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNlYzQ4OTkiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50"></div>
                  </div>
                ))}
              </div>
            ) : (
`;
tarot = tarot.replace(/\{\!selectedMinor \? \(\s*<div\s*className="w-32 h-48[^>]+>\s*<div[^>]+><\/div>\s*<Icon[^>]+><\/Icon>\s*<span[^>]+>Draw<\/span>\s*<\/div>\s*\) : \(/, visualDrawMinor);

// Display AI tokens
tarot = tarot.replace(
  '{reading && (',
  `{reading && (\\n          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein relative">\\n            <div className="text-[10px] font-mono text-indigo-400/50 absolute top-3 right-4">AI Oracle Generated {tokenUsage ? \`(\~$\{tokenUsage} tokens)\` : ''}</div>`
);

// We need to clean up the double `<div className="bg-indigo...` because we just prepended it to `{reading && (` which also has it.
fs.writeFileSync('src/jsx/tab-tarot.jsx', tarot);
