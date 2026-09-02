const fs = require('fs');
let code = fs.readFileSync('src/js/ai-rules.js', 'utf8');

code = code.replace(
/model: "llama-3\.1-8b-instant",/g,
'model: "llama3-8b-8192",'
);
fs.writeFileSync('src/js/ai-rules.js', code);
