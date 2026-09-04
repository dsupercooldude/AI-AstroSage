const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(
  /<div className="text-white\/90 font-sans text-sm leading-relaxed whitespace-pre-wrap">\s*\{askSummary\}\s*<\/div>/,
  `<div className="text-white/90 font-sans text-sm leading-relaxed whitespace-pre-line">
              {window.formatMarkdown ? window.formatMarkdown(askSummary) : askSummary}
            </div>`
);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
