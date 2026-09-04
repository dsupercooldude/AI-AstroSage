const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  /className=\{\`fixed inset-0 -z-20 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat \$\{activeTabId === key \? 'opacity-40' : 'opacity-0'\}\`\}/g,
  `className={\`fixed inset-0 -z-20 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat \${activeTabId === key ? 'opacity-40' : 'opacity-0'}\`} style={{ backgroundImage: \`url(\${url})\` }}`
);

fs.writeFileSync('src/App.tsx', c);
