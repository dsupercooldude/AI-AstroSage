const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');
c = c.replace(
  /if \(typeof decodedProfiles === 'string' && decodedProfiles\.startsWith\("ECIES:"\)\) \{/g,
  `if (typeof decodedProfiles === 'string' && decodedProfiles.startsWith("ECIES_ERROR:")) {
           throw new Error("DECRYPTION_FAILED: " + decodedProfiles.substring(12));
       }
       if (typeof decodedProfiles === 'string' && decodedProfiles.startsWith("ECIES:")) {`
);
c = c.replace(
  /if \(typeof decodedSettings === 'string' && decodedSettings\.startsWith\("ECIES:"\)\) \{/g,
  `if (typeof decodedSettings === 'string' && decodedSettings.startsWith("ECIES_ERROR:")) {
           throw new Error("DECRYPTION_FAILED: " + decodedSettings.substring(12));
       }
       if (typeof decodedSettings === 'string' && decodedSettings.startsWith("ECIES:")) {`
);
fs.writeFileSync('src/jsx/modals.jsx', c);
