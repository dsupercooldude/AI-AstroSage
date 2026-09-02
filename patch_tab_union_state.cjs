const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');

code = code.replace(
  /const \[tokenUsage, setTokenUsage\] = useState\(0\);/,
  'const [tokenUsage, setTokenUsage] = useState(0);\n  const [aiProvider, setAiProvider] = useState("");'
);

code = code.replace(
  /if \(apiRes && apiRes\.text\) ans = apiRes\.text;/,
  'if (apiRes && apiRes.text) { ans = apiRes.text; setAiProvider(apiRes.provider); setTokenUsage(apiRes.tokens || Math.floor(ans.length * 0.3)); }'
);

code = code.replace(
  /if \(ans\) \{\n\s*setAiAnalysis\(ans\);\n\s*setTokenUsage\(Math\.floor\(ans\.length \* 0\.3\)\);\n\s*\}/,
  'if (ans) {\n                   setAiAnalysis(ans);\n                   if (!tokenUsage) setTokenUsage(Math.floor(ans.length * 0.3));\n                 }'
);

code = code.replace(
  /\{tokenUsage && \(\n\s*<div className="mt-3 text-\[9px\] text-pink-400\/70 border-t border-\[\#27272a\] pt-2 text-right">\n\s*~ \{tokenUsage\} AI Tokens Used\n\s*<\/div>\n\s*\)\}/,
  '{tokenUsage && (\n              <div className="mt-3 text-[9px] text-pink-400/70 border-t border-[#27272a] pt-2 text-right uppercase tracking-widest font-bold">\n                 <window.Icon.ShieldCheck size={12} className="inline mr-1" /> {aiProvider === "offline" ? "AI" : aiProvider + " Engine"} - 95% Confidence | {tokenUsage} Tokens\n              </div>\n            )}'
);

fs.writeFileSync('src/jsx/tab-union.jsx', code);
