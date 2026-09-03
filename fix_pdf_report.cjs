const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(/\{latest\.analysis\}/g, '{latest.reading || latest.analysis || latest.text}');

// Add summary rendering if present
c = c.replace(/<div className="text-white\/80 font-mono text-sm leading-relaxed bg-black\/30 p-4 rounded-lg border border-\[\#27272a\]">/g, `{latest.summary && (
                     <div className="text-emerald-400 font-bold mb-2">AI Summary: {latest.summary}</div>
                  )}
                  <div className="text-white/80 font-mono text-sm leading-relaxed bg-black/30 p-4 rounded-lg border border-[#27272a]">`);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
