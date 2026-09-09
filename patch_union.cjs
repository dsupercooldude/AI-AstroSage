const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');

c = c.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-3">[\s\S]*?<\/div>\n      <window\.RelationshipGraph/g,
  `<div className="bg-[#18181b] rounded-3xl border border-[#27272a] shadow-xl overflow-hidden mt-6">
        <div className="p-5 border-b border-[#27272a] flex items-center justify-between bg-black/40">
          <h3 className="font-serif text-lg text-pink-200 flex items-center gap-2"><window.Icon name="table" /> Ashtakoot Guna Milan Matrix</h3>
          <div className="text-[10px] font-mono text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">8-Fold Matchmaking</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-black/60 border-b border-[#27272a] text-[9px] uppercase font-mono tracking-widest text-slate-500">
                <th className="p-4 font-bold">Koota (Factor)</th>
                <th className="p-4 font-bold">Domain Meaning</th>
                <th className="p-4 font-bold">Score</th>
                <th className="p-4 font-bold">Max</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/50">
              {Object.entries(match.details || {}).map(([key, value]) => {
                const max = detailMap[key]?.max || 1;
                const ratio = Number(value) / max;
                let statusColor = "text-emerald-400";
                let statusIcon = "check-circle";
                if (ratio < 0.5) { statusColor = "text-red-400"; statusIcon = "x-circle"; }
                else if (ratio < 1) { statusColor = "text-amber-400"; statusIcon = "warning-circle"; }
                return (
                  <tr key={key} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-mono text-sm text-pink-300 font-bold uppercase tracking-wider">{key}</td>
                    <td className="p-4 text-xs text-white/70 font-sans leading-relaxed max-w-sm">{detailMap[key]?.meaning || "-"}</td>
                    <td className="p-4 font-mono font-bold text-white text-lg">{Number(value).toFixed(1)}</td>
                    <td className="p-4 font-mono text-slate-500">{max.toFixed(1)}</td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <window.Icon name={statusIcon} className={statusColor} size={20} />
                        <div className="w-16 h-1.5 bg-black/50 rounded-full overflow-hidden border border-[#27272a]">
                          <div className={\`h-full rounded-full \${ratio >= 1 ? 'bg-emerald-400' : ratio >= 0.5 ? 'bg-amber-400' : 'bg-red-400'}\`} style={{ width: \`\${Math.min(100, ratio * 100)}%\` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <window.RelationshipGraph`
);

fs.writeFileSync('src/jsx/tab-union.jsx', c);
