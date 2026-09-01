const fs = require('fs');

let palm = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');
palm = palm.replace(
  /\{m\.text\}/,
  '{m.role === "assistant" && <div className="text-[9px] text-violet-400 opacity-60 mb-1 font-bold tracking-widest uppercase flex items-center gap-1"><window.Icon.ShieldCheck size={12}/> AI Confidence: High</div>}\n                {m.text}'
);
fs.writeFileSync('src/jsx/tab-palmistry.jsx', palm);

