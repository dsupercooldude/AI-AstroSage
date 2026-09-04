const fs = require('fs');

// Patch tab-ask.jsx
let c1 = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');
c1 = c1.replace(
  /<div className="text-sm text-white\/80 font-mono leading-relaxed whitespace-pre-wrap beauty-scroll">\s*\{summary\}\s*<\/div>/,
  `<div className="text-sm text-white/80 font-mono leading-relaxed whitespace-pre-line beauty-scroll">
            {window.formatMarkdown ? window.formatMarkdown(summary) : summary}
          </div>`
);
fs.writeFileSync('src/jsx/tab-ask.jsx', c1);

// Patch pdf-report.jsx
let c2 = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');
c2 = c2.replace(
  /<div className="text-white\/80 font-mono text-sm leading-relaxed whitespace-pre-wrap">\s*\{askSummary\}\s*<\/div>/,
  `<div className="text-white/80 font-mono text-sm leading-relaxed whitespace-pre-line">
              {window.formatMarkdown ? window.formatMarkdown(askSummary) : askSummary}
            </div>`
);
fs.writeFileSync('src/jsx/pdf-report.jsx', c2);

