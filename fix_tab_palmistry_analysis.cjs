const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

c = c.replace(/gl_palmistry_analysis_\$\{emHash\}\.json/g, 'gl_palmistry_analysis_${emHash}_${pr?.id || "default"}.json');

fs.writeFileSync('src/jsx/tab-palmistry.jsx', c);
