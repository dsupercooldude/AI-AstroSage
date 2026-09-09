const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

c = c.replace(
  /const relevantContext = h\.slice\(-8\)\.map/g,
  `const relevantContext = h.filter(x => x.p === pr?.id).slice(-8).map`
);

fs.writeFileSync('src/jsx/tab-ask.jsx', c);
