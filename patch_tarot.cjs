const fs = require('fs');
let tarot = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

const newAiCall = `
      let ans = "";
      if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {
         const res = await window.executeMultiProviderAI(prompt, settings, "You are a mystical, wise Tarot Reader. Synthesize the meaning of the drawn cards in relation to the user's focus.");
         if (res && res.text) ans = res.text;
      }
      if (!ans && window.runVedicRuleEngine) {
         ans = window.runVedicRuleEngine(prompt, {}, {}, new Date(), "", false);
      }
      if (!ans) ans = "The Oracle is silent. The energies are shifting. Try again later.";
      
      setInterpretation(ans);
      setTokenUsage(Math.floor(ans.length * 0.25)); // token estimation
`;

tarot = tarot.replace(/const res = await window\.queryAI\(prompt, "auto"\);\s*setInterpretation\(res\?\.text \|\| "The Oracle is silent\."\);/, newAiCall);

fs.writeFileSync('src/jsx/tab-tarot.jsx', tarot);
