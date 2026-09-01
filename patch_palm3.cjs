const fs = require('fs');
let palm = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

palm = palm.replace(
  '<button onClick={captureFrame} className="px-3 py-2 rounded-xl bg-violet-500 text-black font-bold text-[10px] uppercase tracking-[0.2em] font-mono">Capture Hand</button>',
  '<button onClick={captureFrame} className="px-3 py-2 rounded-xl bg-violet-500 text-black font-bold text-[10px] uppercase tracking-[0.2em] font-mono">Capture Hand</button>\n            <button onClick={stopCameraStream} className="px-3 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-[10px] uppercase tracking-[0.2em] font-mono">Stop Camera</button>'
);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', palm);
