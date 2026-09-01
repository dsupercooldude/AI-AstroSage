const fs = require('fs');
let tarot = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

tarot = tarot.replace(
  '{reading && (\\n          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein relative">\\n            <div className="text-[10px] font-mono text-indigo-400/50 absolute top-3 right-4">AI Oracle Generated {tokenUsage ? `(~${tokenUsage} tokens)` : \'\'}</div>          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein relative">',
  '{reading && (\n          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein relative">\n            <div className="text-[10px] font-mono text-indigo-400/50 absolute top-3 right-4 flex gap-1"><window.Icon name="sparkle" /> AI Oracle</div>'
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', tarot);
