const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

const targetGochara = `{!isExpert && <p className="text-xs text-slate-400 font-mono mb-4">Transits (Gochara) measure where the planets are in the sky *today* and how they interact with your static birth chart.</p>}`;

const replacementGochara = `{!isExpert && (
          <div className="text-xs text-slate-400 font-mono mb-4 bg-black/40 p-3 rounded-xl border border-[#27272a]">
            Transits (Gochara) measure where the planets are in the sky *today* and how they interact with your static birth chart. 
            <div className="mt-2 text-[10px] flex gap-4">
              <span className="text-emerald-400 font-bold">&gt;80: Highly Favorable / Strong Flow</span>
              <span className="text-amber-400 font-bold">50-80: Moderate / Stable</span>
              <span className="text-rose-400 font-bold">&lt;50: High Friction / Requires Patience</span>
            </div>
          </div>
        )}`;

c = c.replace(targetGochara, replacementGochara);

fs.writeFileSync('src/jsx/tab-person.jsx', c);
