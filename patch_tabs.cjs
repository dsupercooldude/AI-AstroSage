const fs = require('fs');
let code = fs.readFileSync('src/jsx/tabs.jsx', 'utf8');

code = code.replace(/<PalmistryTab pr=\{pr\} \/>/, '<PalmistryTab pr={pr} settings={settings} />');
code = code.replace(/<CompatTab prs=\{prs\} chs=\{chs\} \/>/, '<CompatTab prs={prs} chs={chs} settings={settings} />');
code = code.replace(/<TarotTab settings=\{u\?\.settings\} \/>/, '<TarotTab settings={settings} />');

fs.writeFileSync('src/jsx/tabs.jsx', code);
