const fs = require('fs');
let ai = fs.readFileSync('src/js/ai-rules.js', 'utf8');

ai = ai.replace(
  'const encP = encodeURIComponent(combinedPrompt);',
  'const encP = encodeURIComponent(systemPrompt + "\\n\\n" + prompt);'
);

fs.writeFileSync('src/js/ai-rules.js', ai);
