const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');
let lines = c.split('\n');
// We want to find the line with "question: \"Hand Capture Analysis\""
let idx = lines.findIndex(l => l.includes('question: "Hand Capture Analysis"'));
if (idx > -1) {
    // The next line is `        }).then(() => window.dispatchEvent(new CustomEvent('refreshVaultHistory', {detail: {module: 'palmistry'}})));`
    // Then lines after that are `           f.content.h = await window.CryptoUtils.encrypt(arr);`, `           await window.AppDB.saveFile(...)`, `        });`
    // We want to delete the lines containing `f.content.h`, `saveFile`, and `});`
    let numRemoved = 0;
    for (let i = idx + 2; i < lines.length; i++) {
        if (lines[i].includes('f.content.h') || lines[i].includes('saveFile') || lines[i].includes('});')) {
            lines[i] = '';
            numRemoved++;
        }
        if (numRemoved === 3) break;
    }
}
fs.writeFileSync('src/jsx/tab-palmistry.jsx', lines.filter(l => l !== '').join('\n'));
