const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

code = code.replace(
  /\{reading\}\n\s*<\/div>/,
  '{window.formatMarkdown ? window.formatMarkdown(reading) : reading}\n            </div>'
);

code = code.replace(
  /\{tokenUsage && \(\n\s*<div className="mt-4 text-\[9px\] text-indigo-400\/50 border-t border-indigo-500\/20 pt-2 text-right">\n\s*~ \{tokenUsage\} AI Tokens Consumed\n\s*<\/div>\n\s*\)\}/,
  '{tokenUsage && (\n              <div className="mt-4 text-[9px] text-indigo-400/50 border-t border-indigo-500/20 pt-2 text-right font-bold uppercase tracking-widest">\n                 <window.Icon.ShieldCheck size={12} className="inline mr-1" /> {window.lastAIProvider || "AI"} Engine - 95% Confidence | {tokenUsage} Tokens\n              </div>\n            )}'
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', code);
