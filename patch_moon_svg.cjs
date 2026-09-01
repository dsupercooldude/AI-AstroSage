const fs = require('fs');
let panStr = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

const svgMoon = `
        <div className="flex items-center justify-center relative w-16 h-16 mr-2">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl"></div>
          {(() => {
             const paksha = pan.paksha || "Shukla";
             const tithis = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Amavasya"];
             const tName = (pan.tithi || "").split(' ')[0];
             let tNum = tithis.indexOf(tName) + 1;
             if (tNum === 0) tNum = 8;
             let phase = (paksha === "Shukla" ? tNum : (15 + tNum)) / 30.0;
             if (tName === "Purnima") phase = 0.5;
             if (tName === "Amavasya") phase = 1.0;
             
             // phase 0.0 to 1.0
             // draw moon
             return (
               <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                 <defs>
                   <radialGradient id="moon-grad">
                     <stop offset="0%" stopColor="#f8fafc" />
                     <stop offset="100%" stopColor="#cbd5e1" />
                   </radialGradient>
                 </defs>
                 {/* Dark background moon */}
                 <circle cx="50" cy="50" r="48" fill="#1e293b" />
                 
                 {/* Waxing (0 to 0.5) */}
                 {phase <= 0.5 && phase > 0 && (
                   <g>
                     {/* Right half is always light, but clipped by an ellipse if < 0.25, or full right half + left ellipse if > 0.25 */}
                     {phase <= 0.25 ? (
                       <path d={\`M 50 2 A 48 48 0 0 1 50 98 A \${48 - phase*4*48} 48 0 0 0 50 2\`} fill="url(#moon-grad)" />
                     ) : (
                       <path d={\`M 50 2 A 48 48 0 0 1 50 98 A \${(phase-0.25)*4*48} 48 0 0 1 50 2\`} fill="url(#moon-grad)" />
                     )}
                   </g>
                 )}
                 {/* Waning (0.5 to 1) */}
                 {phase > 0.5 && phase < 1 && (
                   <g>
                     {phase <= 0.75 ? (
                       <path d={\`M 50 2 A 48 48 0 0 0 50 98 A \${(0.75-phase)*4*48} 48 0 0 1 50 2\`} fill="url(#moon-grad)" />
                     ) : (
                       <path d={\`M 50 2 A 48 48 0 0 0 50 98 A \${(phase-0.75)*4*48} 48 0 0 0 50 2\`} fill="url(#moon-grad)" />
                     )}
                   </g>
                 )}
               </svg>
             );
          })()}
        </div>
`;

// we want to put this in the panchang tab header, replacing the Validate Live API block.
panStr = panStr.replace(/<div className="flex flex-col items-center justify-center relative w-16 h-16 mr-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, svgMoon);
fs.writeFileSync('src/jsx/tab-panchang.jsx', panStr);
