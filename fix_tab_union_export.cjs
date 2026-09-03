const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');
c = c.replace(/window\.TabUnion = /g, 'window.CompatTab = ');
fs.writeFileSync('src/jsx/tab-union.jsx', c);
