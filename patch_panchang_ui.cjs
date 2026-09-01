const fs = require('fs');
let pan = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

pan = pan.replace(
  'className="max-w-4xl mx-auto space-y-6 gl-fadein pb-20"',
  'className="max-w-4xl mx-auto space-y-6 gl-fadein pb-20 mt-4"'
);

// Beautify the Panchang headers
pan = pan.replace(
  '<div className="bg-[#18181b] p-6 rounded-3xl border border-[#27272a] shadow-2xl transition hover:border-[#3f3f46]">',
  '<div className="bg-gradient-to-br from-indigo-900/20 to-black p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden group">'
);

// Add a glowing background effect
pan = pan.replace(
  '<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">',
  '<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-all"></div>\n        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">'
);

// Beautify the Grid items in Daily Panchang
pan = pan.replace(
  /className="p-3 bg-black\/30 rounded-xl border border-white\/5"/g,
  'className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 shadow-inner hover:bg-indigo-900/40 transition"'
);

pan = pan.replace(
  /className="t50 block font-mono text-\[9px\] uppercase mb-0\.5"/g,
  'className="text-indigo-300/70 block font-mono text-[10px] uppercase font-bold tracking-wider mb-1"'
);

pan = pan.replace(
  /className="t100 font-bold"/g,
  'className="text-indigo-100 font-bold text-base font-serif"'
);

fs.writeFileSync('src/jsx/tab-panchang.jsx', pan);
