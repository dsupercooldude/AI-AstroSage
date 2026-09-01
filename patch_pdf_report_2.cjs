const fs = require('fs');
let pdf = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

// Update GhostPDFReport signature
pdf = pdf.replace(
  'window.GhostPDFReport = React.forwardRef(({ profile, ch, bioScores, date }, ref) => {',
  'window.GhostPDFReport = React.forwardRef(({ profile, ch, bioScores, date, prs, chs }, ref) => {'
);

const newLogic = `      {(() => {
        try {
          const savedPair = JSON.parse(localStorage.getItem('astrograh_union_pair') || '[]');
          if (Array.isArray(savedPair) && savedPair.length === 2 && prs && chs) {
            const p1 = prs.find(p => p.id === savedPair[0]);
            const p2 = prs.find(p => p.id === savedPair[1]);
            const c1 = chs[savedPair[0]];
            const c2 = chs[savedPair[1]];
            
            if (p1 && p2 && c1 && c2 && window.calculateAshtakoot) {
               const ashtakoot = window.calculateAshtakoot(c1, c2);
               if (ashtakoot && ashtakoot.details) {
                  return (
                    <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                      <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Ashtakoot Milan (Compatibility)</h3>
                      <div className="bg-[#121426] p-6 rounded-2xl border border-white/10 mb-6">
                        <p className="text-sm text-white/80 mb-4 font-mono">The 36-point Ashtakoot compatibility system measures harmony across 8 dimensions of life partnership.</p>
                        <div className="text-lg font-bold text-amber-300 mb-2">Total Score: {Number(ashtakoot.score).toFixed(1)}/36</div>
                        <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 mb-4">
                          <div className="h-full bg-gradient-to-r from-amber-600 to-emerald-400" style={{ width: \`\${Math.min(100, (ashtakoot.score / 36) * 100)}%\` }}></div>
                        </div>
                        <div className="text-xs text-white/50 font-mono mt-2">Analysis between {p1.name} & {p2.name}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(ashtakoot.details).map(([param, points]) => (
                          <div key={param} className="bg-black/30 p-4 rounded-xl border border-white/5">
                            <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">{param}</div>
                            <div className="font-bold text-amber-200 text-lg">{Number(points).toFixed(1)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
               }
            }
          }
        } catch (e) {}
        return null;
      })()}`;

const oldLogicRegex = /\{\(\(\) => \{\s*try \{\s*const savedPair = JSON\.parse\(localStorage\.getItem\('astrograh_union_pair'\) \|\| '\[\]'\);\s*if \(Array\.isArray\(savedPair\) && savedPair\.length === 2\) \{[\s\S]*?return null;\s*\}\)\(\)\}/;

pdf = pdf.replace(oldLogicRegex, newLogic);
fs.writeFileSync('src/jsx/pdf-report.jsx', pdf);
