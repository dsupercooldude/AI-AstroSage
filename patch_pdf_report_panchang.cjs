const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const targetPanchangLoc = `{/* ========================================== */}
      {/* PAGE 4: PLANETARY STRENGTHS (SHADBALA)     */}`;

const panchangPage = `{/* ========================================== */}
      {/* PAGE 3B: PANCHANG (DAILY TIMING)           */}
      {/* ========================================== */}
      {(() => {
        const panchangDate = new Date();
        const JD = window.julianDay(
            panchangDate.getFullYear() + "-" + String(panchangDate.getMonth() + 1).padStart(2, '0') + "-" + String(panchangDate.getDate()).padStart(2, '0'),
            panchangDate.getHours() + ":" + panchangDate.getMinutes(),
            profile.utcOffset
        );
        const panchang = window.calculatePanchang(JD, profile.utcOffset);
        
        return (
          <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
            <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Daily Panchang & Timing</h3>
            <div className="bg-[#121426] p-8 rounded-2xl border border-[#27272a]">
              <p className="text-sm text-white/80 mb-6 font-mono">Current Panchang snapshot calculated for the report generation time.</p>
              
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-black/30 p-4 rounded-xl border border-[#27272a]">
                    <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">Tithi (Lunar Day)</div>
                    <div className="font-bold text-amber-200 text-lg">{panchang.tithiName}</div>
                    <div className="text-[10px] text-white/40 font-mono mt-1">Completion: {panchang.tithiRemain.toFixed(1)}% remaining</div>
                 </div>
                 
                 <div className="bg-black/30 p-4 rounded-xl border border-[#27272a]">
                    <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">Nakshatra (Lunar Mansion)</div>
                    <div className="font-bold text-amber-200 text-lg">{panchang.nakName}</div>
                    <div className="text-[10px] text-white/40 font-mono mt-1">Lord: {window.SIGN_LORDS[panchang.nakName] || "Varies"}</div>
                 </div>
                 
                 <div className="bg-black/30 p-4 rounded-xl border border-[#27272a]">
                    <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">Yoga (Luni-Solar)</div>
                    <div className="font-bold text-amber-200 text-lg">{panchang.yogaName}</div>
                 </div>
                 
                 <div className="bg-black/30 p-4 rounded-xl border border-[#27272a]">
                    <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">Karana (Half-Tithi)</div>
                    <div className="font-bold text-amber-200 text-lg">{panchang.karanaName}</div>
                 </div>
              </div>
            </div>
          </div>
        );
      })()}

      `;
      
c = c.replace(targetPanchangLoc, panchangPage + targetPanchangLoc);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
