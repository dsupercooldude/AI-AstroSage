const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(/gl_tarot_\$\{emHash\}\.json/g, 'gl_tarot_${emHash}_${profile.id}.json');
c = c.replace(/gl_palmistry_analysis_\$\{emHash\}\.json/g, 'gl_palmistry_analysis_${emHash}_${profile.id}.json');

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
