const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div id="google_translate_element" className="shrink-0 [&_.goog-te-combo]:pl-6 [&_.goog-te-combo]:bg-transparent [&_.goog-te-combo]:outline-none [&_.goog-te-combo]:text-xs [&_.goog-te-combo]:cursor-pointer [&_.goog-te-combo]:text-white" style={{ minWidth: '100px' }}></div>`;

// Replace the SECOND occurrence (or just replace all except the first one)
// The first one is in the GoogleTranslate component itself.

const parts = c.split(target);
if (parts.length > 2) {
    // we have at least 2 occurrences
    c = parts[0] + target + parts[1] + '<GoogleTranslate />' + parts.slice(2).join(target);
    fs.writeFileSync('src/App.tsx', c);
}
