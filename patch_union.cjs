const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');

const targetStr = `    </div>\n  );\n};`;
const replaceStr = `      <window.RelationshipGraph prs={prs} chs={chs} />\n    </div>\n  );\n};`;

c = c.replace(targetStr, replaceStr);

fs.writeFileSync('src/jsx/tab-union.jsx', c);
