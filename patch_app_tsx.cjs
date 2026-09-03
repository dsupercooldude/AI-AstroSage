const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/const el = document.getElementById\('pdf-render-target'\);\n\s*if \(\!el\) return;/g, `window.dispatchEvent(new Event("refreshPdfData"));
      const el = document.getElementById('pdf-render-target');
      if (!el) return;`);

fs.writeFileSync('src/App.tsx', c);
