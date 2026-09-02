const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

code = code.replace(
  /const handlePdf = async \(\) => \{/,
  'const handlePdf = async () => {\n          window.dispatchEvent(new Event("refreshPdfData"));\n'
);

fs.writeFileSync('src/jsx/app.jsx', code);
