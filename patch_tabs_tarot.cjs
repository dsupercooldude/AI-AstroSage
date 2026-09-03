const fs = require('fs');
let c = fs.readFileSync('src/jsx/tabs.jsx', 'utf8');
c = c.replace(/<TarotTab settings=\{settings\} emHash=\{u\?\.emailHash\} \/>/, '<TarotTab settings={settings} emHash={u?.emailHash} pr={pr} />');
fs.writeFileSync('src/jsx/tabs.jsx', c);
