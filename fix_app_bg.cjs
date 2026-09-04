const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// There are duplicate style tags because I replaced it twice in the previous step
// Let's remove the duplicate style tag
c = c.replace(
  /className=\{\`fixed inset-0 -z-20 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat \$\{activeTabId === key \? 'opacity-40' : 'opacity-0'\}\`\} style=\{\{ backgroundImage: \`url\(\$\{url\}\)\` \}\}\n\s*style=\{\{ backgroundImage: \`url\(\$\{url\}\)\` \}\}/g,
  `className={\`fixed inset-0 -z-20 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat \${activeTabId === key ? 'opacity-40' : 'opacity-0'}\`} style={{ backgroundImage: \`url(\${url})\` }}`
);

// We need to remove the bg-[#09090b] that sits at z-30 in App.tsx which blocks the backgrounds!
c = c.replace(
  /<div className="fixed inset-0 -z-30 bg-\[#09090b\]"><\/div>/g,
  `<div className="fixed inset-0 -z-30 bg-black"></div>`
);

fs.writeFileSync('src/App.tsx', c);
