const fs = require('fs');
let c = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

if (!c.compilerOptions.types) {
  c.compilerOptions.types = [];
}
if (!c.compilerOptions.types.includes("vite/client")) {
  c.compilerOptions.types.push("vite/client");
}
if (!c.compilerOptions.types.includes("vite-plugin-pwa/client")) {
  c.compilerOptions.types.push("vite-plugin-pwa/client");
}

fs.writeFileSync('tsconfig.json', JSON.stringify(c, null, 2));
