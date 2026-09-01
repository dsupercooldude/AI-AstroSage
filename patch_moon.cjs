const fs = require('fs');
let panStr = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

const moonVisual = `
        <div className="flex flex-col items-center justify-center relative w-16 h-16 mr-2">
          <div className="absolute inset-0 bg-indigo-900/40 rounded-full blur-md"></div>
          {(() => {
             // Calculate approximate phase for visual
             const paksha = pan.paksha || "Shukla";
             // Extract tithi number using a simple heuristic (e.g. from name if pan.tithiNum isn't available)
             const tithis = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Amavasya"];
             const tName = (pan.tithi || "").split(' ')[0];
             let tNum = tithis.indexOf(tName) + 1;
             if (tNum === 0) tNum = 8; // fallback
             
             // 0 to 1 scale where 0 is New Moon, 0.5 is Full Moon, 1 is New Moon
             let phasePercent = (paksha === "Shukla" ? tNum : (15 + tNum)) / 30;
             if (tName === "Purnima") phasePercent = 0.5;
             if (tName === "Amavasya") phasePercent = 1.0;
             
             const isWaning = phasePercent > 0.5;
             const width = isWaning ? ((1 - phasePercent) * 200) : (phasePercent * 200); // 0 to 100
             
             // CSS trick for moon phase using border-radius and box-shadow
             return (
               <div className="relative w-12 h-12 rounded-full bg-slate-900 border border-slate-700 shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.1)] overflow-hidden">
                 {/* The illuminated part */}
                 <div className="absolute top-0 bottom-0 rounded-full bg-slate-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      style={{
                        left: isWaning ? '0' : \`\${100 - width}%\`,
                        right: isWaning ? \`\${100 - width}%\` : '0',
                        width: \`\${width}%\`,
                        filter: 'blur(1px)'
                      }}>
                 </div>
               </div>
             );
          })()}
        </div>
`;

panStr = panStr.replace(/<div className="flex flex-col items-center justify-center gap-1">[\s\S]*?<\/div>/, moonVisual);
fs.writeFileSync('src/jsx/tab-panchang.jsx', panStr);
