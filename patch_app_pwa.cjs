const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(
  /import \{ AmbientBackground \} from '\.\/jsx\/ambient';/,
  `import { AmbientBackground } from './jsx/ambient';\nimport { PWAInstallButton } from './jsx/PWAInstallButton';`
);

c = c.replace(
  /<div className="flex items-center gap-1\.5 bg-\[#09090b\] border border-\[#27272a\] rounded-xl px-2 py-1 relative">/,
  `<PWAInstallButton />\n            <div className="flex items-center gap-1.5 bg-[#09090b] border border-[#27272a] rounded-xl px-2 py-1 relative">`
);

fs.writeFileSync('src/App.tsx', c);
