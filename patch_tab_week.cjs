const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-week.jsx', 'utf8');

c = c.replace(
  /setTimeout\(\(\) => \{[\s\S]*?\}, 1500\);/m,
  `const generateLive = async () => {
      try {
          const topPlanet = Object.entries(ch.shadbala || {}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "Sun";
          const activeDasha = ch.dasha?.[0]?.lord || "Jupiter";
          
          let extContext = "";
          try {
             const tarot = await window.VaultHistoryService.getLogs("tarot", window.localStorage.getItem('vault_emHash'), pr?.id || "default");
             const recentTarot = tarot.filter(t => Date.now() - new Date(t.ts).getTime() <= 7 * 24 * 60 * 60 * 1000);
             if (recentTarot.length) extContext += "Recent Tarot: " + recentTarot.map(t => t.summary || t.reading).join(" | ") + "\\n";
             
             const palm = await window.VaultHistoryService.getLogs("palmistry", window.localStorage.getItem('vault_emHash'), pr?.id || "default");
             const recentPalm = palm.filter(t => Date.now() - new Date(t.ts).getTime() <= 7 * 24 * 60 * 60 * 1000);
             if (recentPalm.length) extContext += "Recent Palmistry: " + recentPalm.map(p => p.summary).join(" | ") + "\\n";
          } catch(e) {}
          
          const prompt = \`As a Vedic Astrologer, write a 7-day forecast for \${pr?.name || 'this person'}. 
They are currently in \${activeDasha} Mahadasha, their strongest planet is \${topPlanet}.
\${extContext}
Format your response exactly as a JSON object with 3 keys: "theme" (overall 7 day theme), "career" (career advice), "home" (home/relationship advice). Do not include markdown codeblocks.\`;

          let generatedForecast = null;
          if (window.executeMultiProviderAI) {
              const aiRes = await window.executeMultiProviderAI(prompt, window.getSettings ? window.getSettings() : {}, "You are an expert Vedic astrologer generating a JSON forecast.");
              if (aiRes && aiRes.text) {
                 try {
                     generatedForecast = JSON.parse(aiRes.text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim());
                 } catch(e) {
                     generatedForecast = { theme: aiRes.text, career: "See theme.", home: "See theme." };
                 }
              }
          }
          
          if (!generatedForecast) {
             generatedForecast = {
               theme: \`You are entering a highly structured 7-day window. With \${topPlanet} holding max Shadbala power and your active \${activeDasha} Mahadasha, expect situations that require you to step up as an authority figure.\`,
               career: \`Mid-week transits favor deep analytical work rather than aggressive expansion.\`,
               home: \`With \${topPlanet}'s power heightened, ensure your communication doesn't come across as overly dominant to family members.\`
             };
          }
          
          localStorage.setItem(cacheKey, JSON.stringify({ data: generatedForecast, timestamp: now }));
          setForecast(generatedForecast);
          setLastUpdated(new Date(now));
      } catch (e) {
          setForecast({ theme: "Failed to generate.", career: "", home: "" });
      }
      setIsLoading(false);
    };
    generateLive();`
);

fs.writeFileSync('src/jsx/tab-week.jsx', c);
