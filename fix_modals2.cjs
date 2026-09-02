const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

const search = `    let prof;
    try {
       prof = typeof decodedProfiles === 'string' ? JSON.parse(decodedProfiles) : (decodedProfiles || []);
    } catch(err) {
       if (typeof decodedProfiles === 'string' && decodedProfiles.startsWith("ECIES:")) throw new Error("Vault is locked to another device (Missing local ECDH keys). Create a new account or reset vault.");
       throw err;
    }
    let sett;
    try {
       sett = typeof decodedSettings === 'string' ? JSON.parse(decodedSettings) : (decodedSettings || {});
    } catch(err) {
       if (typeof decodedSettings === 'string' && decodedSettings.startsWith("ECIES:")) throw new Error("Vault is locked to another device (Missing local ECDH keys). Create a new account or reset vault.");
       throw err;
    }`;

const replacement = `    let prof;
    try {
       prof = typeof decodedProfiles === 'string' ? JSON.parse(decodedProfiles) : (decodedProfiles || []);
    } catch(err) {
       if (typeof decodedProfiles === 'string' && decodedProfiles.startsWith("ECIES:")) {
           throw new Error("DEVICE_LOCKED: Vault is locked to your original device's encryption keys. You cannot access this data from a new browser.");
       }
       throw err;
    }
    let sett;
    try {
       sett = typeof decodedSettings === 'string' ? JSON.parse(decodedSettings) : (decodedSettings || {});
    } catch(err) {
       if (typeof decodedSettings === 'string' && decodedSettings.startsWith("ECIES:")) {
           throw new Error("DEVICE_LOCKED: Vault is locked to your original device's encryption keys.");
       }
       throw err;
    }`;

c = c.replace(search, replacement);

const uiSearch = `{err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2.5 mb-3 rounded-xl border border-red-500/20">{err}</div>}`;
const uiReplace = `{err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2.5 mb-3 rounded-xl border border-red-500/20">{err.startsWith("DEVICE_LOCKED:") ? (<div><p>{err.split(':')[1]}</p><button type="button" onClick={async () => { if(confirm('This will PERMANENTLY ERASE your cloud vault and reset it for this device. Are you sure?')) { const vault = await AppDB.getFile(\`gl_vault_\${await AppDB.hashKey(e.trim().toLowerCase())}.json\`); vault.content = { profiles: [], settings: {} }; await AppDB.saveFile(\`gl_vault_\${await AppDB.hashKey(e.trim().toLowerCase())}.json\`, vault.content, vault.sha); alert('Vault wiped. Please sign in again.'); setErr(''); } }} className="mt-2 w-full py-1.5 bg-red-500 text-black font-bold rounded">Wipe & Reset Vault</button></div>) : err}</div>}`;

c = c.replace(uiSearch, uiReplace);

fs.writeFileSync('src/jsx/modals.jsx', c);
