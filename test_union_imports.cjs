const fs = require('fs');
const content = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');
console.log(content.split('\n').slice(0, 20).join('\n'));
