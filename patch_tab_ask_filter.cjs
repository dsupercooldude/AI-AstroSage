const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

c = c.replace(
  /h\.filter\(x => \!x\.p \|\| x\.p === pr\?\.id\)/g,
  `h.filter(x => x.p === pr?.id)`
);

fs.writeFileSync('src/jsx/tab-ask.jsx', c);
