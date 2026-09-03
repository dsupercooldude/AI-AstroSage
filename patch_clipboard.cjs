const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

const target = `navigator.clipboard.writeText(exportKeyStr).catch(()=>console.log("Clipboard blocked"));`;
const replace = `if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(exportKeyStr).catch(()=>console.log("Clipboard blocked")); } else { console.log("Clipboard API not available"); }`;

c = c.replace(target, replace);
fs.writeFileSync('src/jsx/modals.jsx', c);
