const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

c = c.replace(
  /try \{\n\s*const pFile.*?catch\(e\)\{\}/s,
  `try {
      palmHist = await window.VaultHistoryService.getLogs("palmistry", emHash, pr?.id || "default");
    } catch(e){}`
);

c = c.replace(
  /try \{\n\s*const tFile.*?catch\(e\)\{\}/s,
  `try {
      tarotHist = await window.VaultHistoryService.getLogs("tarot", emHash, pr?.id || "default");
    } catch(e){}`
);

fs.writeFileSync('src/jsx/tab-ask.jsx', c);
