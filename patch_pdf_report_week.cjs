const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const targetWeekLoc = `{/* ========================================== */}
      {/* PAGE 10, 11, 12, 13: 12-MONTH MATRIX       */}
      {/* ========================================== */}`;

const weekPage = `{/* ========================================== */}
      {/* PAGE 9B: WEEKLY FORECAST                   */}
      {/* ========================================== */}
      {(() => {
        const cacheKey = \`ai_week_\${profile?.name?.replace(/\\s+/g, '_')}\`;
        let weekData = null;
        try {
            const cached = JSON.parse(localStorage.getItem(cacheKey));
            if (cached && cached.data) weekData = cached.data;
        } catch(e){}
        
        if (!weekData) return null;
        
        return (
          <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
            <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Weekly AI Forecast</h3>
            
            <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a] mb-8">
              <div className="text-xs text-amber-500 uppercase font-mono mb-2 tracking-widest border-b border-amber-500/20 pb-2">Energy & Focus</div>
              <p className="text-sm text-white/80 leading-relaxed font-mono whitespace-pre-wrap">{weekData.energyFocus}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a]">
                 <div className="text-xs text-emerald-400 uppercase font-mono mb-2 tracking-widest border-b border-emerald-400/20 pb-2">Favorable For</div>
                 <ul className="list-disc list-inside text-sm text-white/70 font-mono space-y-2">
                    {weekData.favorableFor.map((item, i) => <li key={i}>{item}</li>)}
                 </ul>
              </div>
              <div className="bg-[#121426] p-6 rounded-2xl border border-[#27272a]">
                 <div className="text-xs text-rose-400 uppercase font-mono mb-2 tracking-widest border-b border-rose-400/20 pb-2">Challenges</div>
                 <ul className="list-disc list-inside text-sm text-white/70 font-mono space-y-2">
                    {weekData.challenges.map((item, i) => <li key={i}>{item}</li>)}
                 </ul>
              </div>
            </div>
            
            <div className="bg-amber-950/20 p-6 rounded-2xl border border-amber-500/20">
              <div className="text-xs text-amber-300 uppercase font-mono mb-2 tracking-widest">Remedy / Upaya</div>
              <p className="text-sm text-white/80 leading-relaxed font-mono">{weekData.remedy}</p>
            </div>
          </div>
        );
      })()}

      `;
      
c = c.replace(targetWeekLoc, weekPage + targetWeekLoc);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
