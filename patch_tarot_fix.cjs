const fs = require('fs');
let tarot = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

const newRead = `
      let ans = "";
      if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {
         const res = await window.executeMultiProviderAI(prompt, settings, "You are a mystical, wise Tarot Reader. Synthesize the meaning of the drawn cards in relation to the user's focus.");
         if (res && res.text) ans = res.text;
      }
      if (!ans && window.runVedicRuleEngine) {
         const dummyCh = { d1: { lagna: 'Aries' }, nak: 'Ashwini', pada: 1 };
         ans = window.runVedicRuleEngine(prompt, {}, dummyCh, new Date(), "", false);
      }
      if (!ans) ans = "The Oracle is silent. The energies are shifting. Try again later.";
      
      setReading(ans);
      setTokenUsage(Math.floor(ans.length * 0.25));
`;

tarot = tarot.replace(/const res = await window\.queryAI\(prompt, "auto"\);[\s\S]*?setReading\("The spirits are quiet\. The AI engine could not connect\."\);\s*\}/, newRead);
fs.writeFileSync('src/jsx/tab-tarot.jsx', tarot);
