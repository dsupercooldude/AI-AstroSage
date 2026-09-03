const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');
c = c.replace(/window\.calculatePanchang\(JD, profile\.utcOffset\)/g, 'window.panchang(panchangDate, "amanta", profile.utcOffset)');
fs.writeFileSync('src/jsx/pdf-report.jsx', c);
