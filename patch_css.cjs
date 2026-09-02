const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

// Ensure root has color-scheme dark to fix dropdown flash
if (!code.includes('color-scheme')) {
  code = `:root {\n  color-scheme: dark;\n}\n` + code;
}

// Fix google translate select visibility
code = code.replace(/\.goog-te-gadget \{[\s\S]*?\}/, `.goog-te-gadget {
  font-family: inherit !important;
  color: transparent !important;
  font-size: 0 !important;
}`);

code = code.replace(/\.goog-te-combo \{[\s\S]*?\}/, `.goog-te-combo {
  margin: 0 !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  background-color: #09090b !important;
  color: #fff !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}`);

fs.writeFileSync('src/index.css', code);
