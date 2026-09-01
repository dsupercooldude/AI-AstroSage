const fs = require('fs');
let pan = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

pan = pan.replace('  );\\n};', '    </div>\\n  );\\n};');
fs.writeFileSync('src/jsx/tab-panchang.jsx', pan);
