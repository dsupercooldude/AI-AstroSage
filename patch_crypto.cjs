const fs = require('fs');
let c = fs.readFileSync('src/js/cryptography.js', 'utf8');

const target = `    initKeys: async () => {`;
const inject = `    exportKeys: () => {
        let privJwk = localStorage.getItem('gl_ecdh_priv');
        let pubJwk = localStorage.getItem('gl_ecdh_pub');
        if(!privJwk || !pubJwk) return null;
        return btoa(JSON.stringify({ priv: privJwk, pub: pubJwk }));
    },
    importKeys: (b64) => {
        try {
            const parsed = JSON.parse(atob(b64));
            if(parsed.priv && parsed.pub) {
                localStorage.setItem('gl_ecdh_priv', parsed.priv);
                localStorage.setItem('gl_ecdh_pub', parsed.pub);
                window.CryptoUtils.staticKeyPair = null; // force reload
                return true;
            }
        } catch(e) {}
        return false;
    },
    initKeys: async () => {`;

c = c.replace(target, inject);
fs.writeFileSync('src/js/cryptography.js', c);
