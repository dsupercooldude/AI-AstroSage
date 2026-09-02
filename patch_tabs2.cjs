const fs = require('fs');
let code = fs.readFileSync('src/jsx/tabs.jsx', 'utf8');

code = code.replace(/<PalmistryTab pr=\{pr\} settings=\{settings\} \/>/, '<PalmistryTab pr={pr} settings={settings} emHash={u?.emailHash} />');
code = code.replace(/<TarotTab settings=\{settings\} \/>/, '<TarotTab settings={settings} emHash={u?.emailHash} />');

fs.writeFileSync('src/jsx/tabs.jsx', code);
