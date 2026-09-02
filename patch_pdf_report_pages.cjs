const fs = require('fs');
let code = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const newPages = `
      {/* ========================================== */}
      {/* PAGE 14: PALMISTRY HISTORY (IF AVAILABLE)  */}
      {/* ========================================== */}
      {palmistryHistory.length > 0 && (() => {
          const valid = palmistryHistory.filter((item) => Date.now() - new Date(item.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
          if (valid.length > 0) {
            const latest = valid[valid.length - 1];
            return (
              <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Hand Palmistry Analysis</h3>
                <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-bold text-amber-300 text-xl">Hand Style</div>
                    <div className="text-white/80 font-mono text-sm">{new Date(latest.ts).toLocaleDateString()}</div>
                  </div>
                  <div className="text-lg font-bold text-amber-200 mb-4">{latest.style}</div>
                  <div className="text-white/80 font-mono text-sm leading-relaxed bg-black/30 p-4 rounded-lg border border-[#27272a]">
                    {latest.analysis}
                  </div>
                </div>
                <div className="mt-8 text-xs text-white/50 font-mono uppercase tracking-widest">
                  Palmistry readings from the last 30 days: {valid.length} capture(s)
                </div>
              </div>
            );
          }
          return null;
      })()}

      {/* ========================================== */}
      {/* PAGE 15: TAROT HISTORY (IF AVAILABLE)      */}
      {/* ========================================== */}
      {tarotHistory.length > 0 && (() => {
          const valid = tarotHistory.filter((item) => Date.now() - new Date(item.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
          if (valid.length > 0) {
            const latest = valid[valid.length - 1];
            return (
              <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
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
                  <div className="text-white/80 font-mono text-sm leading-relaxed bg-black/30 p-4 rounded-lg border border-[#27272a]">
                    {latest.analysis}
                  </div>
                </div>
                <div className="mt-8 text-xs text-white/50 font-mono uppercase tracking-widest">
                  Tarot readings from the last 30 days: {valid.length} reading(s)
                </div>
              </div>
            );
          }
          return null;
      })()}

      {/* ========================================== */}
      {/* PAGE 16: AI SAGE PROFILE SUMMARY           */}
      {/* ========================================== */}
      {askSummary && (
        <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
          <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">AI Sage Profile Summary</h3>
          <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
            <p className="text-sm text-white/80 mb-4 font-mono">This summary is synthesized from your ongoing discussions with the AI Vedic Sage.</p>
            <div className="text-white/90 font-sans text-sm leading-relaxed whitespace-pre-wrap">
              {askSummary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
`;

// Replacing everything from "PAGE 14" to the end
const startIndex = code.indexOf('{/* PAGE 14: PALMISTRY HISTORY');
if (startIndex !== -1) {
  code = code.substring(0, startIndex - 51) + newPages;
  fs.writeFileSync('src/jsx/pdf-report.jsx', code);
}
