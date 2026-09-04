const fs = require('fs');
let c = fs.readFileSync('tsconfig.json', 'utf8');

c = c.replace(
  /"types": \["vite\/client"\]/,
  `"types": ["vite/client", "vite-plugin-pwa/client"]`
);

fs.writeFileSync('tsconfig.json', c);
