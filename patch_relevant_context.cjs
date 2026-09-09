const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

c = c.replace(
  /const relevantContext = "";/g,
  `const relevantContext = h.filter(x => x.p === pr?.id).slice(-4).map((item) => \`Q: \$\{item.q\}; A: \$\{String(item.a || "").slice(0, 100)\}\`).join(" | ");`
);

fs.writeFileSync('src/jsx/tab-ask.jsx', c);
