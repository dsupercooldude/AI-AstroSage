const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(/gl_chat_\$\{emHash\}\.json/g, 'gl_chats_${emHash}.json');
c = c.replace(/chatFile\.content\.history/g, 'chatFile.content.h');

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
