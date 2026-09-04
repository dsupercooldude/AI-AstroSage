const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

const targetRx = `<p className="text-xs text-slate-400 font-mono mb-4">{dynamicRx.action}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">`;

const replacementRx = `<p className="text-xs text-slate-400 font-mono mb-4">{dynamicRx.action}</p>
        {dynamicRx.backupAction && (
           <p className="text-[10px] text-indigo-400/80 font-mono mb-4 bg-indigo-950/20 p-2 rounded border border-indigo-500/20">{dynamicRx.backupAction}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">`;

c = c.replace(targetRx, replacementRx);
fs.writeFileSync('src/jsx/tab-person.jsx', c);
