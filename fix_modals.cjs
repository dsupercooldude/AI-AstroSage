const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

const search = `    const prof = typeof decodedProfiles === 'string' ? JSON.parse(decodedProfiles) : (decodedProfiles || []);
    const sett = typeof decodedSettings === 'string' ? JSON.parse(decodedSettings) : (decodedSettings || {});`;

const replacement = `    let prof;
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

c = c.replace(search, replacement);
fs.writeFileSync('src/jsx/modals.jsx', c);
