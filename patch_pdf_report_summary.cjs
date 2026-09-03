const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(/const chatFile = await window\.AppDB\.getFile\(\`gl_chats_\$\{emHash\}\.json\`\);[\s\S]*?setAskSummary\(""\);\n\s*\}/, `
        try {
           const sumFile = await window.AppDB.getFile(\`gl_profile_summary_\${emHash}_\${profile.id}.json\`);
           const sstr = typeof sumFile.content.summary === "string" ? await window.CryptoUtils.decrypt(sumFile.content.summary) : sumFile.content.summary;
           if (sstr) setAskSummary(sstr);
           else setAskSummary("");
        } catch(e){
           setAskSummary("");
        }
`);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
