const fs = require('fs');
let code = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

code = code.replace(
  /const palmFile = await window\.AppDB\.getFile\(\`gl_palmistry_\$\{emHash\}\.json\`\);/,
  'const palmFile = await window.AppDB.getFile(`gl_palmistry_analysis_${emHash}.json`);'
);

fs.writeFileSync('src/jsx/pdf-report.jsx', code);
