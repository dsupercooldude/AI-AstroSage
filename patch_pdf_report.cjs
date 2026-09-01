const fs = require('fs');
let pdf = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

// Update GhostPDFReport signature
pdf = pdf.replace(
  'window.GhostPDFReport = React.forwardRef(({ profile, ch, bioScores, date }, ref) => {',
  'window.GhostPDFReport = React.forwardRef(({ profile, ch, bioScores, date, prs, chs }, ref) => {'
);

// Replace the union milan logic
const oldLogic = `      {(() => {
        try {
          const savedPair = JSON.parse(localStorage.getItem('astrograh_union_pair') || '[]');
          if (Array.isArray(savedPair) && savedPair.length === 2) {
            const ashtakoot = window.calculateAshtakoot ? window.calculateAshtakoot(savedPair[0], savedPair[1]) : null;
            if (ashtakoot) {
              return (
                <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                  <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Ashtakoot Milan (Compatibility)</h3>
                  <div className="bg-[#121426] p-6 rounded-2xl border border-white/10 mb-6">
                    <p className="text-sm text-white/80 mb-4 font-mono">The 36-point Ashtakoot compatibility system measures harmony across 8 dimensions of life partnership.</p>
                    <div className="text-lg font-bold text-amber-300 mb-2">Total Score: {Math.round(ashtakoot.totalScore)}/36</div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 mb-4">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-emerald-400" style={{ width: \`\${Math.min(100, (ashtakoot.totalScore / 36) * 100)}%\` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(ashtakoot).filter(([k]) => k !== 'totalScore').map(([param, points]) => (
                      <div key={param} className="bg-black/30 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">{param}</div>
                        <div className="font-bold text-amber-200 text-lg">{points}/3</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          }
        } catch (e) {}
        return null;
      })()}`;

// We will construct a regex to carefully replace this block, since regex on large chunks is prone to errors.
