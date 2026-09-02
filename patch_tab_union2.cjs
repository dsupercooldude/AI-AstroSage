const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');

code = code.replace(
  /\{aiAnalysis && <div className="bg-black\/40 border border-\[\#27272a\] rounded-xl p-4 text-sm text-white\/85 leading-relaxed shadow-inner mt-4 whitespace-pre-wrap markdown-body"><window\.ReactMarkdown>\{aiAnalysis\}<\/window\.ReactMarkdown><\/div>\}/,
  '{aiAnalysis && <div className="bg-black/40 border border-[#27272a] rounded-xl p-4 text-sm text-white/85 leading-relaxed shadow-inner mt-4">{window.formatMarkdown ? window.formatMarkdown(aiAnalysis) : aiAnalysis}</div>}'
);

fs.writeFileSync('src/jsx/tab-union.jsx', code);
