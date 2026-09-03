const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

const target = `{err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2.5 mb-3 rounded-xl border border-red-500/20">{err}</div>}`;
const replacement = `{err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2.5 mb-3 rounded-xl border border-red-500/20">{err.startsWith("DECRYPTION_FAILED:") || err.startsWith("DEVICE_LOCKED:") ? (<div><p>{err.includes(':') ? err.split(':')[1] : err}</p><button type="button" onClick={async () => { if(confirm('This will PERMANENTLY ERASE your cloud vault and reset it for this device. Are you sure?')) { const emailHash = await AppDB.hashKey(e.trim().toLowerCase()); const vault = await AppDB.getFile(\`gl_vault_\${emailHash}.json\`); vault.content = { profiles: [], settings: {} }; await AppDB.saveFile(\`gl_vault_\${emailHash}.json\`, vault.content, vault.sha); alert('Vault wiped. Please sign in again.'); setErr(''); } }} className="mt-2 w-full py-1.5 bg-red-500 text-black font-bold rounded">Wipe & Reset Vault</button></div>) : err}</div>}`;

c = c.split(target).join(replacement);

fs.writeFileSync('src/jsx/modals.jsx', c);
