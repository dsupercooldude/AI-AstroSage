const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

code = code.replace(
  /\{m\.text\}/g,
  '{m.role === "assistant" && window.formatMarkdown ? window.formatMarkdown(m.text) : m.text}'
);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', code);
