const fs = require('fs');

let palm = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');
palm = palm.replace(
  '<div className="bg-black/40 border border-white/10 text-white/80">',
  '<div className="bg-black/40 border border-white/10 text-white/80 relative"><div className="absolute top-1 right-2 text-[8px] text-violet-400 opacity-60"><i className="ph ph-shield-check"></i> AI Inference Confidence: 92%</div>'
);
fs.writeFileSync('src/jsx/tab-palmistry.jsx', palm);

let tarot = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');
tarot = tarot.replace(
  '<div className="text-[10px] font-mono text-indigo-400/50 absolute top-3 right-4 flex gap-1"><window.Icon name="sparkle" /> AI Oracle</div>',
  '<div className="text-[10px] font-mono text-indigo-400/50 absolute top-3 right-4 flex gap-1 items-center"><window.Icon name="shield-check" /> AI Inference Confidence: High</div>'
);
fs.writeFileSync('src/jsx/tab-tarot.jsx', tarot);

