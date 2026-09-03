const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(/const latest = valid\[valid\.length - 1\];\n\s*return \(\n\s*<div className="pdf-page/g, `const recent = valid.slice().reverse().slice(0, 3);
            return recent.map((latest, index) => (
              <div key={index} className="pdf-page`);

c = c.replace(/<\/div>\n\s*\);\n\s*\}\n\s*return null;\n\s*\}\)\(\)\}\n\s*\{\/\* ==========================================/g, `</div>
            ));
          }
          return null;
      })()}
      {/* ==========================================`);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
