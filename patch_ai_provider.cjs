const fs = require('fs');
let code = fs.readFileSync('src/js/ai-rules.js', 'utf8');

code = code.replace(
  /window\.dispatchEvent\(new CustomEvent\('aiTokenUsage'/g,
  'window.lastAIProvider = target ? target.id : (prov ? prov.id : "ai");\n          window.dispatchEvent(new CustomEvent(\'aiTokenUsage\''
);

fs.writeFileSync('src/js/ai-rules.js', code);
