
window.CryptoUtils = {
    b64E: s => btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (m, p) => String.fromCharCode('0x' + p))),
    b64D: s => decodeURIComponent(atob(s).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')),
    
    xorDecrypt: (b) => {
        if (!b) return b;
        try {
            if(!b.match(/^[A-Za-z0-9+/=]+$/)) return b;
            let d = window.CryptoUtils.b64D(b);
            let r = '';
            for(let i=0; i<d.length; i++) r += String.fromCharCode(d.charCodeAt(i) ^ "SAGE2026".charCodeAt(i % 8));
            return r;
        } catch(e) { return b; }
    },

    exportKeys: () => {
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
    initKeys: async () => {
        if (window.CryptoUtils.staticKeyPair) return window.CryptoUtils.staticKeyPair;
        let privJwk = localStorage.getItem('gl_ecdh_priv');
        let pubJwk = localStorage.getItem('gl_ecdh_pub');
        
        if (privJwk && pubJwk) {
            const priv = await crypto.subtle.importKey("jwk", JSON.parse(privJwk), { name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
            const pub = await crypto.subtle.importKey("jwk", JSON.parse(pubJwk), { name: "ECDH", namedCurve: "P-256" }, true, []);
            window.CryptoUtils.staticKeyPair = { publicKey: pub, privateKey: priv };
        } else {
            const keyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
            const exportedPriv = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
            const exportedPub = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
            localStorage.setItem('gl_ecdh_priv', JSON.stringify(exportedPriv));
            localStorage.setItem('gl_ecdh_pub', JSON.stringify(exportedPub));
            window.CryptoUtils.staticKeyPair = keyPair;
        }
        return window.CryptoUtils.staticKeyPair;
    },

    encrypt: async (d) => {
        if (!d) return d;
        let s = typeof d === 'object' ? JSON.stringify(d) : String(d);
        
        const staticKeyPair = await window.CryptoUtils.initKeys();
        const ephemeralKeyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
        const ephemeralPubJwk = await crypto.subtle.exportKey("jwk", ephemeralKeyPair.publicKey);
        const ephemeralPubStr = JSON.stringify(ephemeralPubJwk);
        
        const aesKey = await crypto.subtle.deriveKey(
            { name: "ECDH", public: staticKeyPair.publicKey },
            ephemeralKeyPair.privateKey,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt"]
        );
        
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(s);
        const cipherBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, aesKey, encoded);
        
        const cipherArray = new Uint8Array(cipherBuffer);
        const ephemPubArray = new TextEncoder().encode(ephemeralPubStr);
        const bundle = new Uint8Array(12 + 2 + ephemPubArray.length + cipherArray.length);
        
        bundle.set(iv, 0);
        bundle[12] = ephemPubArray.length >> 8;
        bundle[13] = ephemPubArray.length & 0xFF;
        bundle.set(ephemPubArray, 14);
        bundle.set(cipherArray, 14 + ephemPubArray.length);
        
        const b64 = btoa(String.fromCharCode(...bundle));
        return "ECIES:" + b64;
    },

    decrypt: async (b) => {
        if (!b) return b;
        if (typeof b === 'string' && !b.startsWith("ECIES:")) {
            const decXor = window.CryptoUtils.xorDecrypt(b);
            try { return JSON.parse(decXor); } catch(e) { return decXor; }
        }
        
        try {
            const b64 = b.substring(6);
            const bundleStr = atob(b64);
            const bundle = new Uint8Array(bundleStr.length);
            for(let i=0; i<bundleStr.length; i++) bundle[i] = bundleStr.charCodeAt(i);
            
            const iv = bundle.slice(0, 12);
            const ephemPubLen = (bundle[12] << 8) | bundle[13];
            const ephemPubArray = bundle.slice(14, 14 + ephemPubLen);
            const cipherArray = bundle.slice(14 + ephemPubLen);
            
            const ephemeralPubStr = new TextDecoder().decode(ephemPubArray);
            const ephemeralPubJwk = JSON.parse(ephemeralPubStr);
            
            const ephemeralPub = await crypto.subtle.importKey("jwk", ephemeralPubJwk, { name: "ECDH", namedCurve: "P-256" }, true, []);
            const staticKeyPair = await window.CryptoUtils.initKeys();
            
            const aesKey = await crypto.subtle.deriveKey(
                { name: "ECDH", public: ephemeralPub },
                staticKeyPair.privateKey,
                { name: "AES-GCM", length: 256 },
                false,
                ["decrypt"]
            );
            
            const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, aesKey, cipherArray);
            const decryptedStr = new TextDecoder().decode(decryptedBuffer);
            try { return JSON.parse(decryptedStr); } catch(e) { return decryptedStr; }
        } catch(e) {
            console.error("Decryption failed", e); return "ECIES_ERROR:" + (e.message || e.toString());
        }
    },

    hashPassword: async (s) => {
         const fb = (str) => { let h = 0; for(let i=0; i<str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0; return "h_" + Math.abs(h).toString(16); };
         try {
             if (!window.crypto || !window.crypto.subtle) return fb(s);
             const buf = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
             return Array.from(new Uint8Array(buf)).map(x=>x.toString(16).padStart(2,'0')).join('');
         } catch (err) { return fb(s); }
     }
};
