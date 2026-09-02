const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');
code = code.replace(/<GhostPDFReport profile=\{aP\}/g, '<GhostPDFReport emHash={u.emailHash} profile={aP}');
fs.writeFileSync('src/jsx/app.jsx', code);
