const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-month.jsx', 'utf8');

c = c.replace(
  /setTimeout\(\(\) => \{[\s\S]*?\}, 1500\);/m,
  `const generateLive = async () => {
      try {
          const topPlanet = Object.entries(ch.shadbala || {}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "Sun";
          const activeDasha = ch.dasha?.[0]?.lord || "Jupiter";
          
          let extContext = "";
          try {
             const tarot = await window.VaultHistoryService.getLogs("tarot", window.localStorage.getItem('vault_emHash'), pr?.id || "default");
             const recentTarot = tarot.filter(t => Date.now() - new Date(t.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
             if (recentTarot.length) extContext += "Recent Tarot: " + recentTarot.map(t => t.summary || t.reading).join(" | ") + "\\n";
             
             const palm = await window.VaultHistoryService.getLogs("palmistry", window.localStorage.getItem('vault_emHash'), pr?.id || "default");
             const recentPalm = palm.filter(t => Date.now() - new Date(t.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
             if (recentPalm.length) extContext += "Recent Palmistry: " + recentPalm.map(p => p.summary).join(" | ") + "\\n";
          } catch(e) {}
          
          const prompt = \`As a Vedic Astrologer, write a 30-day forecast for \${pr?.name || 'this person'}. 
They are currently in \${activeDasha} Mahadasha, their strongest planet is \${topPlanet}.
\${extContext}
Format your response exactly as a JSON object with 4 keys: "overview" (overall 30 day theme), "finance" (wealth advice), "relationships" (social advice), "health" (wellbeing). Do not include markdown codeblocks.\`;

          let generatedForecast = null;
          if (window.executeMultiProviderAI) {
              const aiRes = await window.executeMultiProviderAI(prompt, window.getSettings ? window.getSettings() : {}, "You are an expert Vedic astrologer generating a JSON forecast.");
              if (aiRes && aiRes.text) {
                 try {
                     generatedForecast = JSON.parse(aiRes.text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim());
                 } catch(e) {
                     generatedForecast = { overview: aiRes.text, finance: "", relationships: "", health: "" };
                 }
              }
          }
          
          if (!generatedForecast) {
             generatedForecast = {
               overview: \`This 30-day cycle is heavily influenced by \${activeDasha} and your dominant \${topPlanet}.\`,
               finance: \`Focus on consolidation rather than new speculative investments.\`,
               relationships: \`A key relationship may require renegotiation of boundaries around the 15th of the month.\`,
               health: \`Support your nervous system through grounding practices.\`
             };
          }
          
          localStorage.setItem(cacheKey, JSON.stringify({ data: generatedForecast, timestamp: now }));
          setForecast(generatedForecast);
          setLastUpdated(new Date(now));
      } catch (e) {
          setForecast({ overview: "Failed to generate.", finance: "", relationships: "", health: "" });
      }
      setIsLoading(false);
    };
    generateLive();`
);

fs.writeFileSync('src/jsx/tab-month.jsx', c);
