import { webcrypto as crypto } from 'node:crypto';

const window = {};
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
    initKeys: async () => {
        if (window.CryptoUtils.staticKeyPair) return window.CryptoUtils.staticKeyPair;
        // Mocking fresh generation for the test
        const keyPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
        window.CryptoUtils.staticKeyPair = keyPair;
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
            console.error("Decryption failed", e);
            return b;
        }
    }
};

async function test() {
    const data = [{ id: "test", name: "Aarav Sharma" }];
    console.log("Original:", JSON.stringify(data));
    const enc = await window.CryptoUtils.encrypt(data);
    console.log("Encrypted length:", enc.length);
    const dec = await window.CryptoUtils.decrypt(enc);
    console.log("Decrypted:", JSON.stringify(dec));
}

test();
