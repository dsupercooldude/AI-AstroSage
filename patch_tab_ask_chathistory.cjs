const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

c = c.replace(
  /const relevantContext = h\.filter\(x => x\.p === pr\?\.id\)\.slice\(-8\)\.map\(\(item\) => \`Question: \$\{item\.q\}; Answer: \$\{String\(item\.a \|\| ""\)\.slice\(0, 400\)\}\`\)\.join\(" \| "\);/g,
  `const relevantContext = "";
      const chatHistory = h.filter(x => x.p === pr?.id).slice(-10).flatMap(item => [
         { role: 'user', text: item.q },
         { role: 'model', text: item.a || "No response." }
      ]);`
);

c = c.replace(
  /const apiRes = await executeMultiProviderAI\(filteredPrompt, set, systemContext\);/g,
  `const apiRes = await executeMultiProviderAI(filteredPrompt, set, systemContext, chatHistory);`
);

c = c.replace(
  /Prior requested context: \$\{relevantContext \|\| "none"\}\./g,
  ``
);

c = c.replace(
  /Prior context: \$\{relevantContext \|\| "none"\}\./g,
  ``
);

fs.writeFileSync('src/jsx/tab-ask.jsx', c);
