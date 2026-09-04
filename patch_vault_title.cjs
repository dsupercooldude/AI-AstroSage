const fs = require('fs');
let c = fs.readFileSync('src/jsx/vault-history.jsx', 'utf8');

c = c.replace(
  /Vault History \(\{logs\.length\}\)/g,
  `Oracle Divination Logs ({logs.length})`
);

fs.writeFileSync('src/jsx/vault-history.jsx', c);
