const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

c = c.replace(/className="font-bold text-xs block mb-0\.5"/g, 'className="font-bold text-xs block mb-0.5 notranslate"');
c = c.replace(/className="font-bold tracking-wide"/g, 'className="font-bold tracking-wide notranslate"');
// Add to currently active Choghadiya
c = c.replace(/className="font-bold text-sm mb-1"/g, 'className="font-bold text-sm mb-1 notranslate"');

fs.writeFileSync('src/jsx/tab-panchang.jsx', c);
