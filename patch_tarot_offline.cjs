const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

c = c.replace(
/if \(\!ans && window\.runVedicRuleEngine\) \{\s*const dummyCh = \{ d1: \{ lagna: 'Aries' \}, nak: 'Ashwini', pada: 1 \};\s*ans = window\.runVedicRuleEngine\(prompt, \{\}, dummyCh, new Date\(\), "", false\);\s*\}/,
`if (!ans) {
         const logs = await window.VaultHistoryService.getLogs("tarot", emHash, pr?.id || "default");
         const pastQueries = logs.filter(l => l.question).slice(-3).map(l => l.question).join(", ");
         
         const suitMeanings = {
           'Cups': 'emotions, relationships, and intuition',
           'Wands': 'passion, drive, and creativity',
           'Swords': 'intellect, conflict, and truth',
           'Pentacles': 'material wealth, career, and grounding'
         };
         const suitMeaning = selectedMinor.suit ? suitMeanings[selectedMinor.suit] || 'practical matters' : 'practical matters';
         
         ans = \`**The Oracle's Vision (Offline Synthesis)**

**Primary Force: \${selectedMajor.name} (\${selectedMajor.reversed ? 'Reversed' : 'Upright'})**
This major archetype represents the core karmic theme surrounding your query "\${q}". \${selectedMajor.reversed ? 'Its energy is currently internalized, blocked, or requiring deep introspection.' : 'Its energy is expressing itself openly and directly in your life trajectory.'} It governs the overarching spiritual lesson you are currently navigating.

**Practical Application: \${selectedMinor.name} (\${selectedMinor.reversed ? 'Reversed' : 'Upright'})**
This card highlights the day-to-day actions and immediate circumstances. Rooted in the realm of \${suitMeaning}, it suggests \${selectedMinor.reversed ? 'a need to reassess your approach or overcome internal resistance in this area' : 'a direct, actionable manifestation of this energy'}.

**Continuous Path Synthesis**
\${pastQueries ? \`Reflecting on your recent divinations ("\${pastQueries}"), a continuous thread emerges. The transition toward \${selectedMajor.name} indicates an ongoing evolution of these past themes.\` : \`This draws a fresh energetic blueprint for your current situation.\`} You are advised to ground the grand archetype of \${selectedMajor.name} using the practical tools offered by \${selectedMinor.name}. The stars and cards illuminate the path, but your free will takes the steps.\`;
      }`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
