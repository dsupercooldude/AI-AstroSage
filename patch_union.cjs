const fs = require('fs');
let un = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');

const newClick = `
            onClick={async () => {
              setLoadingAi(true);
              try { 
                 const ashtakoot = window.calculateAshtakoot(p1, p2);
                 const details = \`Varna: \${ashtakoot.varna}/1, Vashya: \${ashtakoot.vashya}/2, Tara: \${ashtakoot.tara}/3, Yoni: \${ashtakoot.yoni}/4, Graha Maitri: \${ashtakoot.grahaMaitri}/5, Gana: \${ashtakoot.gana}/6, Bhakoot: \${ashtakoot.bhakoot}/7, Nadi: \${ashtakoot.nadi}/8\`;
                 const prompt = \`Analyze marital compatibility between \${p1.name} (Lagna: \${c1.d1.lagna}, Moon: \${c1.moonSign}, Nakshatra: \${c1.nak}) and \${p2.name} (Lagna: \${c2.d1.lagna}, Moon: \${c2.moonSign}, Nakshatra: \${c2.nak}). Their total Ashtakoot score is \${score}/36. Breakdown: \${details}. Provide a deep, insightful Vedic astrological relationship analysis outlining their core dynamics, strengths, and potential karmic challenges.\`;
                 
                 let ans = "";
                 if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {
                     const apiRes = await window.executeMultiProviderAI(prompt, settings, "You are an expert Vedic relationship astrologer.");
                     if (apiRes && apiRes.text) ans = apiRes.text;
                 }
                 if (!ans) {
                     ans = window.runVedicRuleEngine(prompt, p1, c1, new Date(), "", false);
                 }
                 
                 if (ans) {
                   setAiAnalysis(ans);
                   setTokenUsage(Math.floor(ans.length * 0.3));
                 }
              } catch (e) {
                 setAiAnalysis("AI Analysis failed. " + e.message);
              }
              setLoadingAi(false);
            }}
`;

un = un.replace(/onClick=\{async \(\) => \{[\s\S]*?\}\}\s*disabled=\{loadingAi\}/, newClick.trim() + '\n            disabled={loadingAi}');
fs.writeFileSync('src/jsx/tab-union.jsx', un);
