const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

code = code.replace(
  /const aP = prs\.find\(p => p\.id === activeProfileId\) \|\| prs\[0\];/,
  'const aP = prs.find(p => p.id === activeProfileId) || prs[0];\n  window.activeProfileId = aP ? aP.id : null;'
);

fs.writeFileSync('src/jsx/app.jsx', code);
