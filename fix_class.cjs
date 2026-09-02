const fs = require('fs');
let code = fs.readFileSync('src/jsx/modals.jsx', 'utf8');
code = code.split('className="bg-[#121426] text-white"').join('');
fs.writeFileSync('src/jsx/modals.jsx', code);
