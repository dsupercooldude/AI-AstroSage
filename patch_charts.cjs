const fs = require('fs');
let charts = fs.readFileSync('src/jsx/charts.jsx', 'utf8');

// East Indian is complex to draw, I'll provide a placeholder or a simplified CSS grid approach
const eastKP = `
      {st.includes("east") && (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
           <div className="w-full aspect-square border-2 border-[#3f3f46] relative">
              {/* Simplified East Indian grid */}
              <div className="absolute top-0 left-1/3 right-1/3 bottom-2/3 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Aries</span></div>
              <div className="absolute top-0 left-0 right-2/3 bottom-2/3 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Taurus/Gemini</span></div>
              <div className="absolute top-1/3 left-0 right-2/3 bottom-1/3 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Cancer</span></div>
              <div className="absolute top-2/3 left-0 right-2/3 bottom-0 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Leo/Virgo</span></div>
              <div className="absolute top-2/3 left-1/3 right-1/3 bottom-0 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Libra</span></div>
              <div className="absolute top-2/3 left-2/3 right-0 bottom-0 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Scorpio/Sag</span></div>
              <div className="absolute top-1/3 left-2/3 right-0 bottom-1/3 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Capricorn</span></div>
              <div className="absolute top-0 left-2/3 right-0 bottom-2/3 border border-[#3f3f46] p-1"><span className="text-[10px] text-white/30">Aquarius/Pisces</span></div>
              <div className="absolute inset-1/3 flex items-center justify-center text-white/50 text-xs font-mono">East Indian</div>
           </div>
        </div>
      )}
      {st.includes("kp") && (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
           {/* KP uses South Indian style usually, but with Placidus cusps */}
           <div className="text-xs font-mono text-amber-500 mb-2 border border-amber-500/30 bg-amber-500/10 px-2 py-1 rounded">KP System (Placidus Cusps)</div>
           <div className="w-full aspect-square border-2 border-amber-500/50 bg-black/40">
             <div className="flex items-center justify-center h-full text-white/50 text-xs font-mono">Placidus Overlay</div>
           </div>
        </div>
      )}
`;

charts = charts.replace(/\{st === "south" && \(/, eastKP + '\n      {st.includes("south") && (');
charts = charts.replace(/st === "north"/g, 'st.includes("north")');

fs.writeFileSync('src/jsx/charts.jsx', charts);
