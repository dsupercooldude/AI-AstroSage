const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

code = code.replace(
  /<div className="flex items-center gap-2">\n\s*\{prs\.length > 1 && \(/,
  '<div className="flex items-center gap-2">\n                <div id="google_translate_element" className="mr-3 scale-90 origin-right hidden md:block"></div>\n                {prs.length > 1 && ('
);

fs.writeFileSync('src/jsx/app.jsx', code);
