// src/js/passkeys.js
window.PasskeyAuth = {
  storagePrefix: "gl_passkey_",

  supported: function () {
    return !!(window.PublicKeyCredential && navigator.credentials);
  },

  encode: function (value) {
    const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  },

  decode: function (value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  },

  randomChallenge: function () {
    return crypto.getRandomValues(new Uint8Array(32));
  },

  getRecord: function (emailHash) {
    try { return JSON.parse(localStorage.getItem(this.storagePrefix + emailHash) || "null"); }
    catch (error) { return null; }
  },

  register: async function (email, emailHash, displayName) {
    if (!this.supported()) throw new Error("Passkeys are not supported in this browser.");
    const rpId = location.hostname;
    if (!rpId || rpId === "localhost" || location.protocol !== "https:") {
      if (location.hostname !== "localhost") throw new Error("Passkeys require HTTPS on deployed websites.");
    }
    const credential = await navigator.credentials.create({ publicKey: {
      challenge: this.randomChallenge(),
      rp: { name: "Graha Ledger", ...(rpId ? { id: rpId } : {}) },
      user: { id: this.randomChallenge(), name: email, displayName: displayName || email },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" },
      timeout: 60000,
      attestation: "none"
    }});
    if (!credential) throw new Error("Passkey registration was cancelled.");
    const record = { credentialId: this.encode(credential.rawId), email, emailHash, rpId, transports: credential.response.getTransports ? credential.response.getTransports() : [] };
    localStorage.setItem(this.storagePrefix + emailHash, JSON.stringify(record));
    return record;
  },

  authenticateRecord: async function (record) {
    if (!this.supported()) throw new Error("Passkeys are not supported in this browser.");
    if (!record) throw new Error("No passkey is registered for this account on this device.");
    const credential = await navigator.credentials.get({ publicKey: {
      challenge: this.randomChallenge(),
      rpId: record.rpId || location.hostname,
      allowCredentials: [{ type: "public-key", id: this.decode(record.credentialId), transports: record.transports || [] }],
      userVerification: "required",
      timeout: 60000
    }});
    if (!credential || this.encode(credential.rawId) !== record.credentialId) throw new Error("Passkey verification failed.");
    return record;
  },

  authenticate: async function (emailHash, remoteRecord = null) {
    return this.authenticateRecord(remoteRecord || this.getRecord(emailHash));
  },

  authenticateAny: async function (records) {
    if (!this.supported()) throw new Error("Passkeys are not supported in this browser.");
    const usableRecords = (records || []).filter((record) => record?.credentialId);
    if (!usableRecords.length) throw new Error("No passkey is registered for any account.");
    const credential = await navigator.credentials.get({ publicKey: {
      challenge: this.randomChallenge(),
      rpId: usableRecords[0].rpId || location.hostname,
      allowCredentials: usableRecords.map((record) => ({ type: "public-key", id: this.decode(record.credentialId), transports: record.transports || [] })),
      userVerification: "required",
      timeout: 60000
    }});
    const credentialId = credential && this.encode(credential.rawId);
    const record = usableRecords.find((item) => item.credentialId === credentialId);
    if (!record) throw new Error("Passkey account could not be identified.");
    return record;
  }
};
