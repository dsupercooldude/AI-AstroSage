const fs = require('fs');
let c = fs.readFileSync('src/js/ai-rules.js', 'utf8');

c = c.replace(
  /window\.lastAIProvider = \(typeof target !== "undefined" && target\) \? target\.id : \(\(typeof prov !== "undefined" && prov\) \? prov\.id : "ai"\);/g,
  `window.lastAIProvider = prov ? prov.id : "ai";`
);

fs.writeFileSync('src/js/ai-rules.js', c);
