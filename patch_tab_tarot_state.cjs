const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

code = code.replace(
  /const \[tokenUsage, setTokenUsage\] = useState\(0\);/,
  'const [tokenUsage, setTokenUsage] = useState(0);\n  const [aiProvider, setAiProvider] = useState("");'
);

code = code.replace(
  /setTokenUsage\(tokens \|\| Math\.floor\(ans\.length \* 0\.25\)\);/,
  'setTokenUsage(tokens || Math.floor(ans.length * 0.25));\n      setAiProvider(provider);'
);

code = code.replace(
  /\{window\.lastAIProvider \|\| "AI"\}/,
  '{aiProvider || "AI"}'
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', code);
