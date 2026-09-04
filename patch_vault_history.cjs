const fs = require('fs');
let c = fs.readFileSync('src/jsx/vault-history.jsx', 'utf8');

const targetGetLogs = `  async getLogs(module, emHash, profileId) {
    if (!emHash || !profileId) return [];
    try {
      const fileName = \`gl_vault_\${module}_\${emHash}_\${profileId}.json\`;
      const hFile = await window.AppDB.getFile(fileName);
      if (hFile && hFile.content && hFile.content.logs) {
        const dec = typeof hFile.content.logs === "string" ? await window.CryptoUtils.decrypt(hFile.content.logs) : hFile.content.logs;
        return typeof dec === "string" ? JSON.parse(dec) : dec || [];
      }
      return [];
    } catch (e) {
      console.error("VaultHistory getLogs error", e);
      return [];
    }
  },`;

const replaceGetLogs = `  async getLogs(module, emHash, profileId) {
    if (!emHash || !profileId) return [];
    let allLogs = [];
    try {
      // 1. Fetch new logs
      const fileName = \`gl_vault_\${module}_\${emHash}_\${profileId}.json\`;
      const hFile = await window.AppDB.getFile(fileName);
      if (hFile && hFile.content && hFile.content.logs) {
        const dec = typeof hFile.content.logs === "string" ? await window.CryptoUtils.decrypt(hFile.content.logs) : hFile.content.logs;
        const parsed = typeof dec === "string" ? JSON.parse(dec) : dec || [];
        allLogs = [...allLogs, ...parsed];
      }
      
      // 2. Fetch legacy logs for Tarot
      if (module === 'tarot') {
          const legFile = await window.AppDB.getFile(\`gl_tarot_\${emHash}_\${profileId}.json\`);
          if (legFile && legFile.content && legFile.content.history) {
              const dec = typeof legFile.content.history === "string" ? await window.CryptoUtils.decrypt(legFile.content.history) : legFile.content.history;
              const parsed = typeof dec === "string" ? JSON.parse(dec) : dec || [];
              allLogs = [...allLogs, ...parsed];
          }
      }
      // 3. Fetch legacy logs for Palmistry
      if (module === 'palmistry') {
          const legFile = await window.AppDB.getFile(\`gl_palmistry_analysis_\${emHash}_\${profileId}.json\`);
          if (legFile && legFile.content && legFile.content.h) {
              const dec = typeof legFile.content.h === "string" ? await window.CryptoUtils.decrypt(legFile.content.h) : legFile.content.h;
              const parsed = typeof dec === "string" ? JSON.parse(dec) : dec || [];
              allLogs = [...allLogs, ...parsed];
          }
      }
      
      // Sort chronologically
      allLogs.sort((a, b) => (a.ts || 0) - (b.ts || 0));
      return allLogs;
    } catch (e) {
      console.error("VaultHistory getLogs error", e);
      return allLogs;
    }
  },`;

c = c.replace(targetGetLogs, replaceGetLogs);
fs.writeFileSync('src/jsx/vault-history.jsx', c);
