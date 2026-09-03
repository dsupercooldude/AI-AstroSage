const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

const targetStr = `        // Also save for PDF
        
        window.VaultHistoryService.saveLog("palmistry", emHash, pr?.id || "default", {
           style: styleGuess,
           analysis: fullAnalysis,
           question: "Hand Capture Analysis"
        }).then(() => window.dispatchEvent(new CustomEvent('refreshVaultHistory', {detail: {module: 'palmistry'}})));
           f.content.h = await window.CryptoUtils.encrypt(arr);
           await window.AppDB.saveFile(\`gl_palmistry_analysis_\${emHash}_\${pr?.id || "default"}.json\`, f.content, f.sha);
        });
    } catch(e) {}`;

const replaceStr = `        // Also save for PDF
        window.VaultHistoryService.saveLog("palmistry", emHash, pr?.id || "default", {
           style: styleGuess,
           analysis: fullAnalysis,
           question: "Hand Capture Analysis"
        }).then(() => window.dispatchEvent(new CustomEvent('refreshVaultHistory', {detail: {module: 'palmistry'}})));
    } catch(e) {}`;

c = c.replace(targetStr, replaceStr);
fs.writeFileSync('src/jsx/tab-palmistry.jsx', c);
