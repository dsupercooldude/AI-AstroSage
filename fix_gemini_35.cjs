const fs = require('fs');
let code = fs.readFileSync('src/js/ai-rules.js', 'utf8');

code = code.replace(
/gemini-1\.5-flash-latest:generateContent/g,
'gemini-3.5-flash:generateContent'
);
fs.writeFileSync('src/js/ai-rules.js', code);
