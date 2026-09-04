// src/jsx/vault-history.jsx
var React = window.React;
var { useState, useEffect } = window.React;

window.VaultHistoryService = {
  async getLogs(module, emHash, profileId) {
    if (!emHash || !profileId) return [];
    let allLogs = [];
    try {
      // 1. Fetch new logs
      const fileName = `gl_vault_${module}_${emHash}_${profileId}.json`;
      const hFile = await window.AppDB.getFile(fileName);
      if (hFile && hFile.content && hFile.content.logs) {
        const dec = typeof hFile.content.logs === "string" ? await window.CryptoUtils.decrypt(hFile.content.logs) : hFile.content.logs;
        const parsed = typeof dec === "string" ? JSON.parse(dec) : dec || [];
        allLogs = [...allLogs, ...parsed];
      }
      
      // 2. Fetch legacy logs for Tarot
      if (module === 'tarot') {
          const legFile = await window.AppDB.getFile(`gl_tarot_${emHash}_${profileId}.json`);
          if (legFile && legFile.content && legFile.content.history) {
              const dec = typeof legFile.content.history === "string" ? await window.CryptoUtils.decrypt(legFile.content.history) : legFile.content.history;
              const parsed = typeof dec === "string" ? JSON.parse(dec) : dec || [];
              allLogs = [...allLogs, ...parsed];
          }
      }
      // 3. Fetch legacy logs for Palmistry
      if (module === 'palmistry') {
          const legFile = await window.AppDB.getFile(`gl_palmistry_analysis_${emHash}_${profileId}.json`);
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
  },
  
  async saveLog(module, emHash, profileId, logEntry) {
    if (!emHash || !profileId) return;
    try {
      const fileName = `gl_vault_${module}_${emHash}_${profileId}.json`;
      const hFile = await window.AppDB.getFile(fileName);
      let logs = [];
      if (hFile.content.logs) {
        const dec = typeof hFile.content.logs === "string" ? await window.CryptoUtils.decrypt(hFile.content.logs) : hFile.content.logs;
        logs = typeof dec === "string" ? JSON.parse(dec) : dec || [];
      }
      
      // Auto-generate AI summary if missing
      if (!logEntry.summary && window.executeMultiProviderAI) {
         try {
            const prompt = `Summarize this ${module} reading in 1 short sentence: ${JSON.stringify(logEntry)}`;
            const res = await window.executeMultiProviderAI(prompt, {}, "You are an expert Vedic summarizer. Keep it to one short sentence.");
            if (res && res.text) {
               logEntry.summary = res.text;
            } else {
               logEntry.summary = "Reading recorded.";
            }
         } catch(e) {
            logEntry.summary = "Reading recorded.";
         }
      } else if (!logEntry.summary) {
         logEntry.summary = "Reading recorded.";
      }
      
      logEntry.ts = Date.now();
      logs.push(logEntry);
      
      hFile.content.logs = await window.CryptoUtils.encrypt(logs);
      await window.AppDB.saveFile(fileName, hFile.content, hFile.sha);
      return logs;
    } catch (e) {
      console.error("VaultHistory saveLog error", e);
      return null;
    }
  }
};

window.VaultHistoryDisplay = ({ module, emHash, profileId }) => {
  const [logs, setLogs] = useState([]);
  
  const fetchLogs = async () => {
    const data = await window.VaultHistoryService.getLogs(module, emHash, profileId);
    setLogs(data);
  };
  
  useEffect(() => {
    fetchLogs();
  }, [module, emHash, profileId]);
  
  // Expose refresh to window so other components can trigger it
  useEffect(() => {
    const handleRefresh = (e) => {
       if (e.detail && e.detail.module === module) {
          fetchLogs();
       }
    };
    window.addEventListener('refreshVaultHistory', handleRefresh);
    return () => window.removeEventListener('refreshVaultHistory', handleRefresh);
  }, [module, emHash, profileId]);
  
  if (logs.length === 0) return null;
  
  return (
    <div className="mt-8 bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-xl">
       <h3 className="font-serif text-xl text-amber-200 border-b border-[#27272a] pb-4 mb-4 flex items-center gap-2">
         <window.Icon name="archive" size={20} />
         Oracle Divination Logs ({logs.length})
       </h3>
       <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 beauty-scroll">
          {logs.slice().reverse().map((log, i) => (
             <div key={i} className="bg-black/40 border border-[#27272a] p-4 rounded-2xl flex flex-col gap-2 relative group">
                <div className="flex justify-between items-start">
                   <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">{new Date(log.ts).toLocaleString()}</div>
                   <div className="text-[10px] text-white/40 font-mono"><window.Icon name="lock-key" className="inline mb-0.5" /> Encrypted</div>
                </div>
                {log.summary && (
                   <div className="text-sm font-sans text-white/90 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20 shadow-inner">
                      <span className="text-emerald-500 font-bold mr-1">AI Summary:</span> {log.summary}
                   </div>
                )}
                {module === 'tarot' && log.cards && (
                   <div className="text-xs text-amber-200/80 font-mono mt-1">Cards: {log.cards.map(c => c?.name).join(' & ')}</div>
                )}
                {module === 'palmistry' && log.style && (
                   <div className="text-xs text-amber-200/80 font-mono mt-1">Identified Style: {log.style}</div>
                )}
                {log.question && (
                   <div className="text-xs text-white/70 italic mt-1 pb-1 border-b border-white/10">"{log.question}"</div>
                )}
                <details className="mt-1">
                   <summary className="text-[10px] text-indigo-400 cursor-pointer uppercase tracking-widest font-mono hover:text-indigo-300">View Full Reading</summary>
                   <div className="text-xs text-white/60 font-sans mt-2 whitespace-pre-wrap pl-2 border-l-2 border-[#27272a]">
                      {log.analysis || log.reading || log.text}
                   </div>
                </details>
             </div>
          ))}
       </div>
    </div>
  );
};
