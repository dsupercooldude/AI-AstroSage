const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Under the "Vedic Jyotish & Biorhythm" tag
const aiStatus = `
                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono rounded uppercase border border-indigo-500/20 font-semibold">
                  Vedic Jyotish & Biorhythm
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded uppercase border border-emerald-500/20 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> AI Engine Online
                </span>
`;
app = app.replace(
  '<span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono rounded uppercase border border-indigo-500/20 font-semibold">\\n                  Vedic Jyotish & Biorhythm\\n                </span>',
  aiStatus
);

fs.writeFileSync('src/App.tsx', app);
