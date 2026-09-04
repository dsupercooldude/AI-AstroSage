const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(/\{palmistryHistory\.length > 0 && \(\(\) => \{[\s\S]*?return null;\n\s*\}\)\(\)\}/, `{(() => {
          const valid = palmistryHistory.filter((item) => Date.now() - new Date(item.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
          if (valid.length > 0) {
            const recent = valid.slice().reverse().slice(0, 3);
            return recent.map((latest, index) => (
              <div key={index} className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Hand Palmistry Analysis</h3>
                <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-amber-300 text-xl">Hand Style</div>
                    <div className="text-white/80 font-mono text-sm">{new Date(latest.ts).toLocaleDateString()}</div>
                  </div>
                  <div className="text-lg font-bold text-amber-200 mb-4">{latest.style || "Palmistry Reading"}</div>
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
             return (
              <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Hand Palmistry Analysis</h3>
                <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8 flex items-center justify-center min-h-[300px]">
                   <p className="text-white/50 font-mono text-sm">No recent Palmistry readings available for this profile.</p>
                </div>
              </div>
             );
          }
      })()}`);

c = c.replace(/\{tarotHistory\.length > 0 && \(\(\) => \{[\s\S]*?return null;\n\s*\}\)\(\)\}/, `{(() => {
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
             return (
              <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Tarot Reading</h3>
                <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8 flex items-center justify-center min-h-[300px]">
                   <p className="text-white/50 font-mono text-sm">No recent Tarot readings available for this profile.</p>
                </div>
              </div>
             );
          }
      })()}`);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
