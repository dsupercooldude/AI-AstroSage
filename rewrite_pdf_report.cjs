const fs = require('fs');
let code = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const newEffect = `
  React.useEffect(() => {
    const fetchData = async () => {
      if (!emHash || !profile) return;
      try {
        const palmFile = await window.AppDB.getFile(\`gl_palmistry_\${emHash}.json\`);
        let ph = [];
        try {
           const pstr = typeof palmFile.content.history === "string" ? await window.CryptoUtils.decrypt(palmFile.content.history) : palmFile.content.history;
           ph = typeof pstr === "string" ? JSON.parse(pstr) : pstr || [];
        } catch(e){}
        setPalmistryHistory(ph.filter(h => h.profileId === profile.id));

        const tarotFile = await window.AppDB.getFile(\`gl_tarot_\${emHash}.json\`);
        let th = [];
        try {
           const tstr = typeof tarotFile.content.history === "string" ? await window.CryptoUtils.decrypt(tarotFile.content.history) : tarotFile.content.history;
           th = typeof tstr === "string" ? JSON.parse(tstr) : tstr || [];
        } catch(e){}
        setTarotHistory(th.filter(h => h.profileId === profile.id));

        const chatFile = await window.AppDB.getFile(\`gl_chat_\${emHash}.json\`);
        let chatHist = [];
        try {
           const cstr = typeof chatFile.content.history === "string" ? await window.CryptoUtils.decrypt(chatFile.content.history) : chatFile.content.history;
           chatHist = typeof cstr === "string" ? JSON.parse(cstr) : cstr || [];
        } catch(e){}
        const thisProfileChat = chatHist.filter(m => !m.profileId || m.profileId === profile.id);
        if (thisProfileChat.length > 0 && window.generateProfileSummary) {
           const summary = window.generateProfileSummary(profile, thisProfileChat);
           setAskSummary(summary);
        } else {
           setAskSummary("");
        }
      } catch (err) {
        console.error("GhostPDFReport data load err", err);
      }
    };
    
    window.addEventListener('refreshPdfData', fetchData);
    fetchData(); // initial fetch
    return () => window.removeEventListener('refreshPdfData', fetchData);
  }, [emHash, profile]);
`;

const startIndex = code.indexOf('React.useEffect(() => {');
const endIndex = code.indexOf('}, [emHash, profile]);') + '}, [emHash, profile]);'.length;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newEffect + code.substring(endIndex);
  fs.writeFileSync('src/jsx/pdf-report.jsx', code);
}
