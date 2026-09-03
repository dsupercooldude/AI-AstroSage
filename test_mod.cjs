const fs = require('fs');
let c = fs.readFileSync('src/js/cryptography.js', 'utf8');
c = c.replace(
  /console\.error\("Decryption failed", e\);\s*return b;/g,
  'console.error("Decryption failed", e); return "ECIES_ERROR:" + (e.message || e.toString());'
);
fs.writeFileSync('src/js/cryptography.js', c);
