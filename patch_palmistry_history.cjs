const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

c = c.replace(/window\.AppDB\.getFile\(\`gl_palmistry_analysis_\$\{emHash\}_\$\{pr\?\.id \|\| "default"\}\.json\`\)\.then\(async \(f\) => \{[\s\S]*?\}\);/g, `
        window.VaultHistoryService.saveLog("palmistry", emHash, pr?.id || "default", {
           style: styleGuess,
           analysis: fullAnalysis,
           question: "Hand Capture Analysis"
        }).then(() => window.dispatchEvent(new CustomEvent('refreshVaultHistory', {detail: {module: 'palmistry'}})));
`);

c = c.replace(/saveHistory\(nc\);/g, `
        window.VaultHistoryService.saveLog("palmistry", emHash, pr?.id || "default", {
           question: userQ,
           analysis: ans,
           provider: provider
        }).then(() => window.dispatchEvent(new CustomEvent('refreshVaultHistory', {detail: {module: 'palmistry'}})));
`);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', c);
