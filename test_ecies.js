const { webcrypto: crypto } = require('crypto');
global.crypto = crypto;

const btoa = (str) => Buffer.from(str, 'binary').toString('base64');
const atob = (b64) => Buffer.from(b64, 'base64').toString('binary');
const localStorageMock = {
  store: {},
  getItem: function(k) { return this.store[k]; },
  setItem: function(k, v) { this.store[k] = v; }
};
global.localStorage = localStorageMock;

window = { CryptoUtils: {} };

window.CryptoUtils = {
    // legacy
    xorDecrypt: b => b,
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
        return "ECIES:" + btoa(String.fromCharCode(...bundle));
    },
    decrypt: async (b) => {
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
        return JSON.parse(decryptedStr);
    }
};

(async () => {
  const enc = await window.CryptoUtils.encrypt({hello: "world", secret: 123});
  console.log(enc);
  const dec = await window.CryptoUtils.decrypt(enc);
  console.log(dec);
})();
