const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');
const target = `      </div>\n    </div>\n  );\n};`;
const replace = `      </div>\n      <window.VaultHistoryDisplay module="palmistry" emHash={emHash} profileId={pr?.id || "default"} />\n    </div>\n  );\n};`;
fs.writeFileSync('src/jsx/tab-palmistry.jsx', c.replace(target, replace));
