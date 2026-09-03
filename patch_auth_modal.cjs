const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

c = c.replace(
  'const [mode, setMode] = useState("login"); const [e, setE]=useState(""); const [p, setP]=useState(""); const [err, setErr]=useState(""); const [gp, setGp]=useState(""); const [mfaPin, setMfaPin] = useState(""); const [passkeyBusy, setPasskeyBusy] = useState(false);',
  'const [mode, setMode] = useState("login"); const [e, setE]=useState(""); const [p, setP]=useState(""); const [err, setErr]=useState(""); const [gp, setGp]=useState(""); const [mfaPin, setMfaPin] = useState(""); const [passkeyBusy, setPasskeyBusy] = useState(false); const [showImport, setShowImport] = useState(false); const [importKeyStr, setImportKeyStr] = useState(""); const [confirmWipe, setConfirmWipe] = useState(false);'
);

const target = `{err.startsWith("DECRYPTION_FAILED:") || err.startsWith("DEVICE_LOCKED:") ? (<div><p className="mb-2 text-red-200">Vault locked to original browser. The encryption keys are missing on this device.</p><button type="button" onClick={() => { const keys = prompt("To migrate, open this app on your ORIGINAL browser, go to Settings -> Export Device Keys, and paste the code here:"); if(keys) { const success = CryptoUtils.importKeys(keys); if(success) { alert("Keys imported successfully! You can now log in."); setErr(''); } else { alert("Invalid key string."); } } }} className="w-full py-2 bg-blue-500 hover:bg-blue-400 transition text-white font-bold rounded mb-2">Import Keys from Old Browser</button><button type="button" onClick={async () => { if(confirm('This will PERMANENTLY ERASE your cloud vault and reset it for this device. Are you sure?')) { const emailHash = await AppDB.hashKey(e.trim().toLowerCase()); const vault = await AppDB.getFile(\`gl_vault_\${emailHash}.json\`); vault.content = { profiles: [], settings: {} }; await AppDB.saveFile(\`gl_vault_\${emailHash}.json\`, vault.content, vault.sha); alert('Vault wiped. Please sign in again.'); setErr(''); } }} className="w-full py-1.5 bg-red-900/50 hover:bg-red-900/80 transition text-red-300 border border-red-500/30 text-[10px] rounded">Delete Cloud Data & Start Fresh</button></div>) : err}`;

const replacement = `{err.startsWith("DECRYPTION_FAILED:") || err.startsWith("DEVICE_LOCKED:") ? (<div><p className="mb-2 text-red-200">Vault locked to original browser. The encryption keys are missing on this device.</p>
  {!showImport && !confirmWipe && (
    <>
      <button type="button" onClick={() => setShowImport(true)} className="w-full py-2 bg-blue-500 hover:bg-blue-400 transition text-white font-bold rounded mb-2">Import Keys from Old Browser</button>
      <button type="button" onClick={() => setConfirmWipe(true)} className="w-full py-1.5 bg-red-900/50 hover:bg-red-900/80 transition text-red-300 border border-red-500/30 text-[10px] rounded">Delete Cloud Data & Start Fresh</button>
    </>
  )}
  {showImport && (
    <div className="mt-2 space-y-2 text-left bg-black/60 p-3 rounded border border-blue-500/30">
      <label className="text-[10px] text-blue-300 font-bold block">Paste Exported Key String:</label>
      <textarea value={importKeyStr} onChange={ev=>setImportKeyStr(ev.target.value)} className="w-full h-16 bg-[#09090b] border border-[#27272a] rounded p-2 text-[10px] font-mono text-slate-300 outline-none resize-none"></textarea>
      <div className="flex gap-2">
        <button type="button" onClick={() => setShowImport(false)} className="flex-1 py-1.5 bg-slate-800 text-white text-xs rounded">Cancel</button>
        <button type="button" onClick={() => {
           if(importKeyStr.trim()) {
             const success = CryptoUtils.importKeys(importKeyStr.trim());
             if(success) { setErr(''); setShowImport(false); setImportKeyStr(""); } else { setImportKeyStr("Invalid Key String"); }
           }
        }} className="flex-1 py-1.5 bg-blue-500 text-white font-bold text-xs rounded">Import</button>
      </div>
    </div>
  )}
  {confirmWipe && (
    <div className="mt-2 space-y-2 bg-red-950/60 p-3 rounded border border-red-500/50 text-left">
      <p className="text-[10px] text-red-300 font-bold leading-tight mb-2">PERMANENTLY ERASE your cloud vault and reset it for this device? You cannot undo this.</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => setConfirmWipe(false)} className="flex-1 py-1.5 bg-slate-800 text-white text-xs rounded">Cancel</button>
        <button type="button" onClick={async () => {
          setConfirmWipe(false);
          const emailHash = await AppDB.hashKey(e.trim().toLowerCase());
          const vault = await AppDB.getFile(\`gl_vault_\${emailHash}.json\`);
          vault.content = { profiles: [], settings: {} };
          await AppDB.saveFile(\`gl_vault_\${emailHash}.json\`, vault.content, vault.sha);
          setErr('Vault wiped successfully. You can now sign in fresh.');
        }} className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded">ERASE VAULT</button>
      </div>
    </div>
  )}
</div>) : err}`;

c = c.replace(target, replacement);
fs.writeFileSync('src/jsx/modals.jsx', c);
