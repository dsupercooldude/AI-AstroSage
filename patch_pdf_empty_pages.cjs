const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(
/else \{\s*return \(\s*<div className="pdf-page.*?No recent Palmistry readings available.*?<\/div>\s*\);\s*\}/s,
`return null;`
);

c = c.replace(
/else \{\s*return \(\s*<div className="pdf-page.*?No recent Tarot readings available.*?<\/div>\s*\);\s*\}/s,
`return null;`
);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
