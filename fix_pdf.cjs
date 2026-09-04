const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const emptyPalmistryReplacement = `return (
  <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
    <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Hand Palmistry Synthesis</h3>
    <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
      <div className="text-xs text-amber-500 uppercase font-mono mb-2 tracking-widest border-b border-amber-500/20 pb-2">Vedic Astrological Proxy</div>
      <div className="text-sm text-white/80 leading-relaxed font-mono whitespace-pre-wrap">
        No recent physical palm scan was detected in your vault for the last 30 days. However, based on your {ch.d1.lagna} Ascendant and {ch.moonSign} Moon, your palmar structure is mathematically likely to exhibit a prominent mount of {Object.keys(ch.shadbala || {}).sort((a,b)=>ch.shadbala[b]-ch.shadbala[a])[0] || 'Jupiter'}, indicating strong natural authority and ambition. The elemental dominant hand shape tends toward the {["Aries", "Leo", "Sagittarius"].includes(ch.d1.lagna) ? "Fire" : ["Taurus", "Virgo", "Capricorn"].includes(ch.d1.lagna) ? "Earth" : ["Gemini", "Libra", "Aquarius"].includes(ch.d1.lagna) ? "Air" : "Water"} archetype. Please scan your palm in the Palmistry tab to overwrite this astrological proxy with true biological data.
      </div>
    </div>
  </div>
);`;

const emptyTarotReplacement = `return (
  <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
    <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Tarot Reading</h3>
    <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
      <div className="text-xs text-amber-500 uppercase font-mono mb-2 tracking-widest border-b border-amber-500/20 pb-2">Vedic Astrological Proxy</div>
      <div className="text-sm text-white/80 leading-relaxed font-mono whitespace-pre-wrap">
        No daily Tarot draw was recorded in your vault for this specific timeline. Based on the current dominant Dasha of {ch.dasha?.[0]?.lord || 'Jupiter'} and the highest Shadbala power of {Object.keys(ch.shadbala || {}).sort((a,b)=>ch.shadbala[b]-ch.shadbala[a])[0] || 'Sun'}, the archetypal resonance of the day aligns heavily with The Emperor or The Hierophant. This indicates a period requiring structure, mentorship, and rigid adherence to established principles rather than emotional speculation. Please visit the Tarot tab to draw your daily specific oracle.
      </div>
    </div>
  </div>
);`;

c = c.replace(/return null;\s*\/\/\s*replaced palmistry empty/g, emptyPalmistryReplacement);
c = c.replace(/return null;\s*\/\/\s*replaced tarot empty/g, emptyTarotReplacement);

// If the previous replace was just `return null;` let's be careful and use regex
c = c.replace(
/\{\(\) => \{\s*const valid = palmistryHistory.*?if \(valid\.length > 0\) \{.*?\} else \{\s*return null;\s*\}\s*\}\)\(\)\}/s,
`{(() => {
          const valid = palmistryHistory.filter((item) => Date.now() - new Date(item.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
          if (valid.length > 0) {
            const recent = valid.slice().reverse().slice(0, 3);
            return recent.map((latest, index) => (
              <div key={index} className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Hand Palmistry Analysis</h3>
                <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-amber-300 text-xl">Identified Style: {latest.style || "Unknown"}</div>
                    <div className="text-white/80 font-mono text-sm">{new Date(latest.ts).toLocaleDateString()}</div>
                  </div>
                  {latest.summary && (
                     <div className="text-emerald-400 font-bold mb-4">AI Summary: {latest.summary}</div>
                  )}
                  <div className="text-white/80 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-black/30 p-4 rounded-lg border border-[#27272a]">
                    {latest.analysis || latest.text}
                  </div>
                </div>
              </div>
            ));
          } else {
             ${emptyPalmistryReplacement}
          }
      })()}`
);

c = c.replace(
/\{\(\) => \{\s*const valid = tarotHistory.*?if \(valid\.length > 0\) \{.*?\} else \{\s*return null;\s*\}\s*\}\)\(\)\}/s,
`{(() => {
          const valid = tarotHistory.filter((item) => Date.now() - new Date(item.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
          if (valid.length > 0) {
            const recent = valid.slice().reverse().slice(0, 3);
            return recent.map((latest, index) => (
              <div key={index} className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Tarot Reading</h3>
                <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-amber-300 text-xl">Question: {latest.question || "General Reading"}</div>
                    <div className="text-white/80 font-mono text-sm">{new Date(latest.ts).toLocaleDateString()}</div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4">
                     {latest.cards && latest.cards.map((c, idx) => (
                        <div key={idx} className="bg-black/40 px-3 py-1.5 rounded-lg border border-[#27272a] text-sm text-amber-200 font-bold">
                          {c.name} {c.isReversed ? "(Reversed)" : "(Upright)"}
                        </div>
                     ))}
                  </div>
                  {latest.summary && (
                     <div className="text-emerald-400 font-bold mb-2">AI Summary: {latest.summary}</div>
                  )}
                  <div className="text-white/80 font-mono text-sm leading-relaxed bg-black/30 p-4 rounded-lg border border-[#27272a]">
                    {latest.reading || latest.analysis || latest.text}
                  </div>
                </div>
              </div>
            ));
          } else {
             ${emptyTarotReplacement}
          }
      })()}`
);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
