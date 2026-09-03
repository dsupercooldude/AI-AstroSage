const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div id="google_translate_element" className="shrink-0 overflow-hidden [&_.goog-te-combo]:pl-6" style={{ minWidth: '100px' }}></div>`;
const replace = `<div id="google_translate_element" className="shrink-0 [&_.goog-te-combo]:pl-6 [&_.goog-te-combo]:bg-transparent [&_.goog-te-combo]:outline-none [&_.goog-te-combo]:text-xs [&_.goog-te-combo]:cursor-pointer [&_.goog-te-combo]:text-white" style={{ minWidth: '100px' }}></div>`;
c = c.replace(target, replace);
fs.writeFileSync('src/App.tsx', c);
