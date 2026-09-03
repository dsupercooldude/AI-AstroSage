const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

const importStr = `  const [chat, setChat] = useState([\n    { role: 'assistant', text: 'This tool is intentionally limited to hand-only analysis. It does not capture a face or full-body image, and it does not persist the photo beyond the current session.' }\n  ]);\n\n`;

// Let's just append <window.VaultHistoryDisplay module="palmistry" emHash={emHash} profileId={pr?.id || "default"} /> at the bottom.
const targetBottom = `      </div>\n    </div>\n    );\n};`;
const replacementBottom = `      </div>\n      <window.VaultHistoryDisplay module="palmistry" emHash={emHash} profileId={pr?.id || "default"} />\n    </div>\n    );\n};`;

c = c.replace(targetBottom, replacementBottom);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', c);
