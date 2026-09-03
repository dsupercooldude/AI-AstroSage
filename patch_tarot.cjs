const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

const targetSave = `      try {
        const hFile = await window.AppDB.getFile(\`gl_tarot_\${emHash}_\${pr?.id || "default"}.json\`);
        let hist = [];
        if (hFile.content.history) {
          const str = typeof hFile.content.history === "string" ? await window.CryptoUtils.decrypt(hFile.content.history) : hFile.content.history;
          hist = typeof str === "string" ? JSON.parse(str) : str || [];
        }
        hist.push({ ts: Date.now(), question: q, reading: ans, cards: [selectedMajor, selectedMinor], profileId: window.activeProfileId || "" });
        hFile.content.history = await window.CryptoUtils.encrypt(hist);
        await window.AppDB.saveFile(\`gl_tarot_\${emHash}_\${pr?.id || "default"}.json\`, hFile.content, hFile.sha);
      } catch(e) {}`;

const replaceSave = `      try {
        await window.VaultHistoryService.saveLog("tarot", emHash, pr?.id || "default", {
           question: q,
           reading: ans,
           cards: [selectedMajor, selectedMinor]
        });
        window.dispatchEvent(new CustomEvent('refreshVaultHistory', {detail: {module: 'tarot'}}));
      } catch(e) {}`;

c = c.replace(targetSave, replaceSave);

const targetBottom = `    </div>\n  );\n};`;
const replaceBottom = `      <window.VaultHistoryDisplay module="tarot" emHash={emHash} profileId={pr?.id || "default"} />\n    </div>\n  );\n};`;

c = c.replace(targetBottom, replaceBottom);

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
