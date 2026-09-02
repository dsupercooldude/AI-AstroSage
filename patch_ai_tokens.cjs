const fs = require('fs');
let code = fs.readFileSync('src/js/ai-rules.js', 'utf8');
code = code.replace(
  /return \{ text: txt, provider: target\.id, tokens \};/g,
  'window.dispatchEvent(new CustomEvent("aiTokenUsage", { detail: { engine: target.id, tokens } }));\n          return { text: txt, provider: target.id, tokens };'
);
code = code.replace(
  /return \{ text: txt, provider: prov\.id, tokens \};/g,
  'window.dispatchEvent(new CustomEvent("aiTokenUsage", { detail: { engine: prov.id, tokens } }));\n          return { text: txt, provider: prov.id, tokens };'
);
fs.writeFileSync('src/js/ai-rules.js', code);
