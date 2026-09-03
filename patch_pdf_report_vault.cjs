const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(/const palmFile = await window\.AppDB\.getFile\(\`gl_palmistry_analysis_\$\{emHash\}_\$\{profile\.id\}\.json\`\);[\s\S]*?setPalmistryHistory\(ph\.filter\(h => h\.profileId === profile\.id\)\);/g, `
        const ph = await window.VaultHistoryService.getLogs("palmistry", emHash, profile.id);
        setPalmistryHistory(ph);
`);

c = c.replace(/const tarotFile = await window\.AppDB\.getFile\(\`gl_tarot_\$\{emHash\}_\$\{profile\.id\}\.json\`\);[\s\S]*?setTarotHistory\(th\.filter\(h => h\.profileId === profile\.id\)\);/g, `
        const th = await window.VaultHistoryService.getLogs("tarot", emHash, profile.id);
        setTarotHistory(th);
`);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
