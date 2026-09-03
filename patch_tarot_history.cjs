const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

// update window.TarotTab = ({ settings, emHash }) => {
c = c.replace(/window\.TarotTab = \(\{ settings, emHash \}\) => \{/, 'window.TarotTab = ({ settings, emHash, pr }) => {');

// find AppDB.getFile
c = c.replace(/gl_tarot_\$\{emHash\}\.json/g, 'gl_tarot_${emHash}_${pr?.id || "default"}.json');

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
