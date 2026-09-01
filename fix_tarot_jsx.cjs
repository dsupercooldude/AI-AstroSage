const fs = require('fs');
let tarot = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

tarot = tarot.replace(
  /\{reading && \(\s*\\n\s*<div className="bg-indigo-900\/20 border border-indigo-500\/30 rounded-2xl p-6 gl-fadein relative">\s*\\n\s*<div className="text-\[10px\] font-mono text-indigo-400\/50 absolute top-3 right-4">AI Oracle Generated \{tokenUsage \? `\(\~\$\{tokenUsage\} tokens\)` : ''\}<\/div>\s*<div className="bg-indigo-900\/20 border border-indigo-500\/30 rounded-2xl p-6 gl-fadein relative">/,
  `{reading && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein relative">
            <div className="text-[10px] font-mono text-indigo-400/50 absolute top-3 right-4">AI Oracle Generated {tokenUsage ? \`(\~\${tokenUsage} tokens)\` : ''}</div>`
);

// If the previous replace failed and the first fix was applied:
tarot = tarot.replace(
  /\{reading && \(\s*\\n\s*<div className="bg-indigo-900\/20 border border-indigo-500\/30 rounded-2xl p-6 gl-fadein relative">\s*\\n\s*<div className="text-\[10px\] font-mono text-indigo-400\/50 absolute top-3 right-4 flex gap-1"><window\.Icon name="sparkle" \/> AI Oracle<\/div>/,
  `{reading && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein relative">
            <div className="text-[10px] font-mono text-indigo-400/50 absolute top-3 right-4 flex gap-1"><window.Icon name="sparkle" /> AI Oracle</div>`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', tarot);
