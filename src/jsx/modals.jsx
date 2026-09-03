// src/jsx/modals.jsx
var React = window.React;
var { useState } = window.React;

// CRYPTOGRAPHIC SAFETY FALLBACK: Prevents undefined errors if crypto.js lags on load
if (!window.CryptoUtils) {
  window.CryptoUtils = {
    hashPassword: async (str) => {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },
    decrypt: (data) => data,
    encrypt: (data) => data,
    b64E: (str) => btoa(str),
    b64D: (str) => atob(str)
  };
}

window.SetupModal = ({ onConfig }) => {
  const { SageLogo, AppDB } = window;
  const [o, setO] = useState("dsupercooldude");
  const [r, setR] = useState("AstroGrah");
  const [t, setT] = useState("");
  const [err, setErr] = useState("");
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gl-fadein"><div className="w-full max-w-sm rounded-3xl bg-[#09090b] p-6 shadow-2xl border border-[#27272a]">
      <form onSubmit={async(e)=>{ e.preventDefault(); setErr(""); await AppDB.setConfig(o,r,t); try{ await AppDB.callApi('GET',''); onConfig(); }catch(er){ if(er.message==="404") { onConfig(); } else { setErr("Token Invalid or Repo Missing."); AppDB.clearConfig(); } } }}>
        <SageLogo size={44}/><h2 className="text-center font-serif text-xl mt-2 mb-4 text-amber-200">Connect Cloud Vault</h2>
        {err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2.5 mb-3 rounded-xl border border-red-500/20">{err.startsWith("DEVICE_LOCKED:") ? (<div><p>{err.split(':')[1]}</p><button type="button" onClick={async () => { if(confirm('This will PERMANENTLY ERASE your cloud vault and reset it for this device. Are you sure?')) { const vault = await AppDB.getFile(`gl_vault_${await AppDB.hashKey(e.trim().toLowerCase())}.json`); vault.content = { profiles: [], settings: {} }; await AppDB.saveFile(`gl_vault_${await AppDB.hashKey(e.trim().toLowerCase())}.json`, vault.content, vault.sha); alert('Vault wiped. Please sign in again.'); setErr(''); } }} className="mt-2 w-full py-1.5 bg-red-500 text-black font-bold rounded">Wipe & Reset Vault</button></div>) : err}</div>}
        <div className="space-y-3">
          <div><label className="text-[10px] t40 uppercase font-mono">GitHub Username</label><input required value={o} onChange={e=>setO(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2.5 text-sm outline-none text-white focus:border-amber-400/50"/></div>
          <div><label className="text-[10px] t40 uppercase font-mono">Repo Name</label><input required value={r} onChange={e=>setR(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2.5 text-sm outline-none text-white focus:border-amber-400/50"/></div>
          <div><label className="text-[10px] t40 uppercase font-mono">Personal Access Token</label><input required type="password" value={t} onChange={e=>setT(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2.5 text-sm outline-none text-white focus:border-amber-400/50"/></div>
        </div>
        <button type="submit" className="w-full bg-amber-400 text-black font-semibold rounded-full py-3 mt-5 hover:bg-amber-300 transition">Authorize & Sync</button>
        <button type="button" onClick={()=>{ AppDB.enableLocal(); onConfig(); }} className="w-full text-xs t60 mt-3 hover:text-white transition">Skip Cloud - Use Offline Local Storage</button>
      </form></div></div>
  );
};

window.AuthModal = ({ onLogin }) => {
  const { SageLogo, Icon, AppDB, CryptoUtils, PasskeyAuth } = window;
  const [mode, setMode] = useState("login"); const [e, setE]=useState(""); const [p, setP]=useState(""); const [err, setErr]=useState(""); const [gp, setGp]=useState(""); const [mfaPin, setMfaPin] = useState(""); const [passkeyBusy, setPasskeyBusy] = useState(false);
  
  const proceedToVault = async (normE, emailHash, reqChange, isMfaEnabled) => {
    const vaultFile = await AppDB.getFile(`gl_vault_${emailHash}.json`);
    const decodedProfiles = typeof vaultFile.content.profiles === 'string' ? await CryptoUtils.decrypt(vaultFile.content.profiles) : vaultFile.content.profiles;
    const decodedSettings = typeof vaultFile.content.settings === 'string' ? await CryptoUtils.decrypt(vaultFile.content.settings) : vaultFile.content.settings;
    let prof;
    try {
       prof = typeof decodedProfiles === 'string' ? JSON.parse(decodedProfiles) : (decodedProfiles || []);
    } catch(err) {
       if (typeof decodedProfiles === 'string' && decodedProfiles.startsWith("ECIES_ERROR:")) {
           throw new Error("DECRYPTION_FAILED: " + decodedProfiles.substring(12));
       }
       if (typeof decodedProfiles === 'string' && decodedProfiles.startsWith("ECIES:")) {
           throw new Error("DEVICE_LOCKED: Vault is locked to your original device's encryption keys. You cannot access this data from a new browser.");
       }
       throw err;
    }
    let sett;
    try {
       sett = typeof decodedSettings === 'string' ? JSON.parse(decodedSettings) : (decodedSettings || {});
    } catch(err) {
       if (typeof decodedSettings === 'string' && decodedSettings.startsWith("ECIES_ERROR:")) {
           throw new Error("DECRYPTION_FAILED: " + decodedSettings.substring(12));
       }
       if (typeof decodedSettings === 'string' && decodedSettings.startsWith("ECIES:")) {
           throw new Error("DEVICE_LOCKED: Vault is locked to your original device's encryption keys.");
       }
       throw err;
    }
    try { localStorage.setItem('gl_active_user', JSON.stringify({ email: normE, emailHash, mfaEnabled: isMfaEnabled })); } catch(ex){}
    onLogin({ email: normE, emailHash, profiles: prof, settings: { aiModel: "auto", monthSystem: "amanta", kundaliStyle: "north", ...sett, apiKeys: { ...(sett.apiKeys || {}) } }, requiresPasswordChange: reqChange, mfaEnabled: isMfaEnabled });
  };
  
  
  const handleSubmit = async (ev) => { 
    ev.preventDefault(); setErr(""); const normE = e.trim().toLowerCase(); 
    try { 
      const emailHash = await AppDB.hashKey(normE); let authFile = await AppDB.getFile('gl_auth.json'); if(!authFile.content.users) authFile.content.users = {};
      if(mode === "signup") { 
        if(authFile.content.users[emailHash]) throw new Error("Email already registered."); 
        const gen="Om-"+Math.random().toString(36).slice(-6)+"!"; const hashedPw = await CryptoUtils.hashPassword(gen); 
        authFile.content.users[emailHash] = { p: hashedPw, req: true }; await AppDB.saveFile('gl_auth.json', authFile.content, authFile.sha); 
        setGp(gen); setMode("generated");
      } else if(mode === "login") { 
        const u = authFile.content.users[emailHash]; 
        if(!u) { if (Object.keys(authFile.content.users).length === 0) throw new Error("Empty Vault! Please Sign Up."); throw new Error("Account not found."); } 
        const hashedInput = await CryptoUtils.hashPassword(p.trim()); if(u.p !== p.trim() && u.p !== hashedInput) throw new Error("Invalid password."); 
        if (u.mfa) { setMode("mfa"); return; } await proceedToVault(normE, emailHash, u.req, !!u.mfa); 
      } else if(mode === "reset") {
        const u = authFile.content.users[emailHash]; 
        if(!u) throw new Error("Account not found.");
        const gen="Om-"+Math.random().toString(36).slice(-6)+"!"; const hashedPw = await CryptoUtils.hashPassword(gen); 
        authFile.content.users[emailHash].p = hashedPw;
        authFile.content.users[emailHash].req = true;
        await AppDB.saveFile('gl_auth.json', authFile.content, authFile.sha);
        setGp(gen); setMode("generated");
      }
    } catch(error) { setErr(error.message); }
  };


  const handlePasskeyLogin = async () => {
    setErr("");
    setPasskeyBusy(true);
    try {
      const normE = e.trim().toLowerCase();
      const authFile = await AppDB.getFile('gl_auth.json');
      let emailHash;
      let record;
      if (normE) {
        emailHash = await AppDB.hashKey(normE);
        const account = authFile.content.users?.[emailHash];
        record = await PasskeyAuth.authenticate(emailHash, account?.passkey);
      } else {
        const records = Object.values(authFile.content.users || {}).map((account) => account.passkey).filter(Boolean);
        record = await PasskeyAuth.authenticateAny(records);
        emailHash = record.emailHash;
      }
      const account = authFile.content.users?.[emailHash];
      if (!account || record.emailHash !== emailHash) throw new Error("Passkey account could not be verified.");
      await proceedToVault(normE || record.email, emailHash, account.req, !!account.mfa);
    } catch (error) { setErr(error.message); }
    finally { setPasskeyBusy(false); }
  };
  
  const handleMfaSubmit = async (ev) => {
    ev.preventDefault(); setErr(""); const normE = e.trim().toLowerCase();
    try {
      const emailHash = await AppDB.hashKey(normE); let authFile = await AppDB.getFile('gl_auth.json'); const u = authFile.content.users[emailHash];
      const secret = await CryptoUtils.decrypt(u.mfa); if (!window.OTPAuth) throw new Error("Authenticator library missing.");
      const totp = new window.OTPAuth.TOTP({ secret: secret }); if (totp.validate({ token: mfaPin, window: 1 }) === null) throw new Error("Invalid 2FA PIN.");
      await proceedToVault(normE, emailHash, u.req, true);
    } catch(err) { setErr(err.message); }
  };

  if (mode === "mfa") return (
    <div className="min-h-screen flex items-center justify-center p-4 gl-fadein"><div className="w-full max-w-sm rounded-3xl bg-[#09090b] p-6 shadow-2xl border border-[#27272a] text-center"><Icon name="shield-check" size={48} className="mx-auto text-emerald-400 mb-3" /><h2 className="font-serif text-2xl mt-1 mb-2 text-emerald-200">2FA Protected</h2><p className="text-xs t60 mb-5">Enter your 6-digit Authenticator app PIN.</p>
      <form onSubmit={handleMfaSubmit}>{err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2.5 mb-3 rounded-xl border border-red-500/20">{err.startsWith("DECRYPTION_FAILED:") || err.startsWith("DEVICE_LOCKED:") ? (<div><p>{err.includes(':') ? err.split(':')[1] : err}</p><button type="button" onClick={async () => { if(confirm('This will PERMANENTLY ERASE your cloud vault and reset it for this device. Are you sure?')) { const emailHash = await AppDB.hashKey(e.trim().toLowerCase()); const vault = await AppDB.getFile(`gl_vault_${emailHash}.json`); vault.content = { profiles: [], settings: {} }; await AppDB.saveFile(`gl_vault_${emailHash}.json`, vault.content, vault.sha); alert('Vault wiped. Please sign in again.'); setErr(''); } }} className="mt-2 w-full py-1.5 bg-red-500 text-black font-bold rounded">Wipe & Reset Vault</button></div>) : err}</div>}<input required type="text" maxLength="6" value={mfaPin} onChange={ev=>setMfaPin(ev.target.value)} placeholder="000000" className="w-full text-center tracking-[0.5em] font-mono font-bold bg-black/40 border border-[#27272a] rounded-xl px-3 py-3 text-lg outline-none text-emerald-300 focus:border-emerald-400/50 mb-4"/><button type="submit" className="w-full bg-emerald-500 text-black font-semibold rounded-full py-3 hover:bg-emerald-400 transition">Unlock Vault</button><button type="button" onClick={()=>setMode("login")} className="mt-4 text-[10px] t50 hover:text-white">Cancel</button></form></div></div>
  );
  if (mode === "generated") return ( <div className="min-h-screen flex items-center justify-center p-4 gl-fadein"><div className="w-full max-w-sm rounded-3xl border border-emerald-500/40 bg-[#09090b] p-6 text-center shadow-2xl"><h2 className="font-serif text-xl t100 mb-1 text-emerald-300">Secure Credentials</h2><p className="text-xs t75 mb-4">Auto-generated secure password:</p><div className="flex gap-2 items-center justify-center mb-3"><div className="flex-1 p-3 bg-black/40 rounded-xl font-mono text-emerald-300 border border-emerald-500/30 text-base select-all">{gp}</div></div><p className="text-[10px] t50">Save this temporary password.</p><button onClick={()=>setMode("login")} className="w-full rounded-full py-3 text-sm font-semibold bg-emerald-500 text-black mt-5">Proceed to Sign In</button></div></div> );
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gl-fadein"><div className="w-full max-w-sm rounded-3xl bg-[#09090b] p-6 shadow-2xl border border-[#27272a] relative">
      <form onSubmit={handleSubmit}><SageLogo size={44}/><h2 className="text-center font-serif text-2xl mt-1 mb-4 text-amber-200">{mode==="signup"?"Create Account":mode==="reset"?"Reset Password":"Sign In"}</h2>{err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2.5 mb-3 rounded-xl border border-red-500/20">{err.startsWith("DECRYPTION_FAILED:") || err.startsWith("DEVICE_LOCKED:") ? (<div><p>{err.includes(':') ? err.split(':')[1] : err}</p><button type="button" onClick={async () => { if(confirm('This will PERMANENTLY ERASE your cloud vault and reset it for this device. Are you sure?')) { const emailHash = await AppDB.hashKey(e.trim().toLowerCase()); const vault = await AppDB.getFile(`gl_vault_${emailHash}.json`); vault.content = { profiles: [], settings: {} }; await AppDB.saveFile(`gl_vault_${emailHash}.json`, vault.content, vault.sha); alert('Vault wiped. Please sign in again.'); setErr(''); } }} className="mt-2 w-full py-1.5 bg-red-500 text-black font-bold rounded">Wipe & Reset Vault</button></div>) : err}</div>}<div className="space-y-3"><div><label className="text-[10px] t40 uppercase font-mono">Email Address (optional for passkey)</label><input type="email" value={e} onChange={ev=>setE(ev.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2.5 text-sm outline-none text-white focus:border-amber-400/50"/></div>{mode==="login" && <div><label className="text-[10px] t40 uppercase font-mono">Password</label><input type="password" value={p} onChange={ev=>setP(ev.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2.5 text-sm outline-none text-white focus:border-amber-400/50"/></div>}</div><button type="submit" className="w-full bg-amber-400 text-black font-semibold rounded-full py-3 mt-5 hover:bg-amber-300 transition shadow-lg shadow-amber-400/20">{mode==="signup"?"Generate Credentials":mode==="reset"?"Reset Password":"Enter Vault"}</button>{mode==="login" && <button type="button" disabled={passkeyBusy} onClick={handlePasskeyLogin} className="w-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold rounded-full py-3 mt-2 hover:bg-emerald-500/25 transition"><Icon name="fingerprint" size={16} /> {passkeyBusy ? "Verifying Passkey..." : "Use Face ID / Passkey"}</button>}
<div className="flex justify-between items-center mt-4 flex-wrap gap-2">
  <button type="button" onClick={()=>{setMode(mode==="login"?"signup":"login"); setErr("");}} className="text-[11px] t60 hover:text-white">{mode==="login"?"New User? Quick Sign Up":"Existing User? Sign In"}</button>
  {mode === "login" && <button type="button" onClick={()=>{setMode("reset"); setErr("");}} className="text-[11px] text-amber-400 hover:text-amber-300">Forgot Password?</button>}
  {mode === "reset" && <button type="button" onClick={()=>{setMode("login"); setErr("");}} className="text-[11px] text-amber-400 hover:text-amber-300">Back to Login</button>}
</div>
</form></div></div>
  );
};

window.ForcePasswordChange = ({ email, emailHash, onComplete }) => {
  const { AppDB, CryptoUtils } = window;
  const [p, setP] = useState(""); const [loading, setLoading] = useState(false);
  return ( <div className="min-h-screen flex items-center justify-center p-4 gl-fadein"><div className="w-full max-w-sm rounded-3xl bg-[#09090b] p-6 border border-emerald-500/40 shadow-2xl"><form onSubmit={async (e) => { e.preventDefault(); if(p.length < 6) return alert('Password too short.'); setLoading(true); try { let authFile = await AppDB.getFile('gl_auth.json'); authFile.content.users[emailHash].p = await CryptoUtils.hashPassword(p); authFile.content.users[emailHash].req = false; await AppDB.saveFile('gl_auth.json', authFile.content, authFile.sha); onComplete(); } catch (err) { alert(err.message); setLoading(false); } }}><h2 className="font-serif text-xl t100 mb-2 text-emerald-300">Set Custom Password</h2><div><label className="text-[10px] t40 uppercase font-mono mb-1 block">New Private Password</label><input required type="password" value={p} onChange={ev=>setP(ev.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2.5 text-sm outline-none text-white focus:border-emerald-500/50"/></div><button type="submit" disabled={loading} className="w-full bg-emerald-500 text-black font-semibold rounded-full py-3 mt-5 hover:bg-emerald-400 transition">{loading ? "Encrypting..." : "Confirm & Launch"}</button></form></div></div> );
};

window.AdminAuthModal = ({ u, onClose, onAuthenticated }) => {
  const { Icon, AppDB, CryptoUtils } = window;
  const [adminUser, setAdminUser] = useState(""); const [pwd, setPw] = useState(""); const [mfa, setMfa] = useState(""); const [err, setErr] = useState("");
  
  const handleAuth = async (e) => {
    e.preventDefault(); setErr("");
    try { 
      let adminFile = await AppDB.getFile('gl_admin.json');
      if (!adminFile.content.adminUser) { const hashedDefault = await CryptoUtils.hashPassword(pwd); adminFile.content = { adminUser: adminUser.trim().toLowerCase(), p: hashedDefault, mfa: null }; await AppDB.saveFile('gl_admin.json', adminFile.content, adminFile.sha); alert("Admin Vault initialized with these credentials."); onAuthenticated(); return; }
      const normAdmin = adminUser.trim().toLowerCase(); if (adminFile.content.adminUser !== normAdmin) throw new Error("Invalid Admin Username.");
      const hashedInput = await CryptoUtils.hashPassword(pwd); if (adminFile.content.p !== pwd && adminFile.content.p !== hashedInput) throw new Error("Invalid Master Admin Password.");
      if (adminFile.content.mfa) { const secret = await CryptoUtils.decrypt(adminFile.content.mfa); const totp = new window.OTPAuth.TOTP({ secret }); if (totp.validate({ token: mfa, window: 1 }) === null) throw new Error("Invalid Admin 2FA PIN."); }
      onAuthenticated();
    } catch (error) { setErr(error.message); }
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" onClick={onClose}><div onClick={e=>e.stopPropagation()} className="w-full max-w-sm bg-[#09090b] p-6 rounded-3xl border border-amber-500/30 shadow-2xl gl-fadein text-center"><Icon name="shield-warning" size={40} className="text-amber-400 mx-auto mb-3"/><h3 className="font-serif text-lg text-white mb-1">Admin Authentication</h3><p className="text-[10px] t60 mb-4">Dedicated Admin credentials required to access DB architecture.</p>
      <form onSubmit={handleAuth} className="space-y-3">{err && <div className="text-[10px] text-red-300 bg-red-900/30 p-2 rounded">{err}</div>}
        <input required type="text" placeholder="Admin Username" value={adminUser} onChange={e=>setAdminUser(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-400/50"/>
        <input required type="password" placeholder="Master Admin Password" value={pwd} onChange={e=>setPw(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-400/50"/>
        <input type="text" maxLength="6" placeholder="Admin 2FA PIN (if configured)" value={mfa} onChange={e=>setMfa(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-400/50 tracking-widest text-center font-mono"/>
        <button type="submit" className="w-full bg-amber-500 text-black font-bold rounded-full py-2.5 hover:bg-amber-400 transition mt-2">Unlock Admin Console</button><button type="button" onClick={onClose} className="text-[10px] t50 hover:text-white mt-3 w-full">Cancel</button>
      </form></div></div>
  );
};

window.AdminConsoleModal = ({ onClose, onResetDb }) => {
  const { Icon, AppDB, CryptoUtils } = window;
  const [o, setO] = useState(AppDB.config?.owner || ""); const [r, setR] = useState(AppDB.config?.repo || ""); const [t, setT] = useState(AppDB.config?.token || ""); const [adminMfaSetup, setAdminMfaSetup] = useState(null);
  const handleSaveDb = async (e) => { e.preventDefault(); if(!confirm("Update Database Configuration?")) return; await AppDB.setConfig(o, r, t); alert("Database configuration updated successfully."); onClose(); };
  const enableAdmin2FA = () => { const secret = new window.OTPAuth.Secret({ size: 20 }).base32; const totp = new window.OTPAuth.TOTP({ issuer: "Graha Ledger Admin", label: "MasterAdmin", algorithm: "SHA1", digits: 6, period: 30, secret: secret }); const uri = totp.toString(); setAdminMfaSetup({ secret, qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`, pin: '' }); };
  const verifyAdmin2FA = async () => { const totp = new window.OTPAuth.TOTP({ secret: adminMfaSetup.secret }); if (totp.validate({ token: adminMfaSetup.pin, window: 1 }) === null) return alert("Invalid PIN."); let adminFile = await AppDB.getFile('gl_admin.json'); adminFile.content.mfa = await CryptoUtils.encrypt(adminMfaSetup.secret); await AppDB.saveFile('gl_admin.json', adminFile.content, adminFile.sha); alert("Admin 2FA Activated Successfully."); setAdminMfaSetup(null); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4" onClick={onClose}><div onClick={e=>e.stopPropagation()} className="w-full max-w-md bg-[#09090b] p-6 rounded-3xl border border-[#27272a] shadow-2xl gl-fadein max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 border-b border-[#27272a] pb-3"><h3 className="font-serif text-lg text-amber-300 flex items-center gap-2"><Icon name="database"/> Dedicated Admin Console</h3><button onClick={onClose} className="hover:text-white t60"><Icon name="x"/></button></div>
      <form onSubmit={handleSaveDb} className="space-y-3">
        <div><label className="text-[9px] t50 uppercase font-mono">GitHub Username</label><input required value={o} onChange={e=>setO(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-sm text-white"/></div>
        <div><label className="text-[9px] t50 uppercase font-mono">Repository Name</label><input required value={r} onChange={e=>setR(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-sm text-white"/></div>
        <div><label className="text-[9px] t50 uppercase font-mono">Personal Access Token</label><input required type="password" value={t} onChange={e=>setT(e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-sm text-white"/></div>
        <button type="submit" className="w-full bg-amber-400 text-black font-bold rounded-full py-2.5 mt-2 hover:bg-amber-300 transition">Update Repo Connection</button>
      </form>
      <div className="mt-5 pt-4 border-t border-[#27272a] space-y-3"><span className="font-mono text-[9px] uppercase t50 block">Admin Security & 2FA</span>
        {!adminMfaSetup ? ( <button type="button" onClick={enableAdmin2FA} className="w-full py-2 bg-emerald-500/20 text-emerald-300 font-semibold rounded-xl text-xs hover:bg-emerald-500/30 border border-emerald-500/30">Set Dedicated Admin 2FA</button> ) : (
          <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30 text-center"><img src={adminMfaSetup.qr} alt="Admin QR" className="w-28 h-28 mx-auto rounded-lg mb-2 bg-white p-1"/><input value={adminMfaSetup.pin} onChange={e=>setAdminMfaSetup({...adminMfaSetup, pin: e.target.value})} maxLength="6" placeholder="Enter PIN" className="w-full text-center tracking-widest font-mono bg-black/50 border border-[#27272a] rounded-lg px-2 py-1.5 text-xs text-emerald-300 mb-2"/><button type="button" onClick={verifyAdmin2FA} className="w-full py-1.5 bg-emerald-500 text-black font-bold rounded-lg text-xs">Verify & Activate</button></div>
        )}
        <button onClick={()=>{ if(confirm("Disconnect and clear database settings? You will be logged out.")) { onResetDb(); } }} className="w-full bg-red-500/20 border border-red-500/30 text-red-300 font-bold rounded-full py-2.5 hover:bg-red-500/40 transition">Disconnect Database</button>
      </div></div></div>
  );
};

window.SettingsModal = ({ u, settings, onClose, onUpdateSettings, onMfaSuccess }) => {
  const { Icon, AppDB, CryptoUtils, PasskeyAuth } = window;
  const [mfaSetup, setMfaSetup] = useState(null);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [passkeyReady, setPasskeyReady] = useState(!!PasskeyAuth?.getRecord(u.emailHash));
  const [localSet, setLocalSet] = useState(settings || { aiModel: "auto", monthSystem: "amanta", kundaliStyle: "north", apiKeys: {} });

  const enableMFA = () => {
    if (!window.OTPAuth) return alert("Authenticator library failed to load.");
    const secret = new window.OTPAuth.Secret({ size: 20 }).base32;
    const totp = new window.OTPAuth.TOTP({ issuer: "Graha Ledger", label: u.email, algorithm: "SHA1", digits: 6, period: 30, secret: secret });
    const uri = totp.toString();
    setMfaSetup({ secret, qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`, pin: "" });
  };

  const verifyAndSaveMfa = async (e) => {
    e.preventDefault();
    if (!window.OTPAuth) return alert("Authenticator library missing.");
    const totp = new window.OTPAuth.TOTP({ secret: mfaSetup.secret });
    if (totp.validate({ token: mfaSetup.pin, window: 1 }) === null) return alert("Invalid PIN. Please check your Authenticator app and try again.");
    const authDB = await AppDB.getFile("gl_auth.json");
    authDB.content.users[u.emailHash].mfa = await CryptoUtils.encrypt(mfaSetup.secret);
    await AppDB.saveFile("gl_auth.json", authDB.content, authDB.sha);
    alert("2FA Enabled Successfully! Your vault is securely locked.");
    onMfaSuccess();
    setMfaSetup(null);
  };

  
  const renderTokenUsage = (engine) => {
    const usage = localSet.tokenUsage?.[engine] || 0;
    const limit = 20000;
    const pct = Math.min((usage / limit) * 100, 100);
    return (
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1 bg-black/60 rounded-full overflow-hidden border border-[#27272a]">
          <div className={`h-full ${usage >= limit ? 'bg-red-500 shadow-[0_0_4px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_4px_#10b981]'}`} style={{ width: `${pct}%` }}></div>
        </div>
        <span className="text-[8px] font-mono text-slate-400">{usage.toLocaleString()} / {limit.toLocaleString()} Tokens Used</span>
      </div>
    );
  };

  const handleKeyChange = (provider, value) => {
    const updated = { ...localSet, apiKeys: { ...(localSet.apiKeys || {}), [provider]: value } };
    setLocalSet(updated);
    onUpdateSettings(updated);
  };

  const handleSelectChange = (key, value) => {
    const updated = { ...localSet, [key]: value };
    setLocalSet(updated);
    onUpdateSettings(updated);
  };

  const registerPasskey = async () => {
    setPasskeyBusy(true);
    try { const record = await PasskeyAuth.register(u.email, u.emailHash, u.email); const authDB = await AppDB.getFile("gl_auth.json"); const account = authDB.content.users?.[u.emailHash]; if (!account) throw new Error("Account record was not found."); account.passkey = { credentialId: record.credentialId, email: u.email, emailHash: u.emailHash, rpId: record.rpId, transports: record.transports }; await AppDB.saveFile("gl_auth.json", authDB.content, authDB.sha); setPasskeyReady(true); alert("Passkey enabled. Your device may now use Face ID, Windows Hello, or its security key to unlock this vault."); }
    catch (error) { alert(error.message); }
    finally { setPasskeyBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg p-6 rounded-3xl border border-[#27272a] bg-[#09090b] space-y-5 max-h-[88vh] overflow-y-auto gl-fadein shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
          <h3 className="font-serif text-lg text-white flex items-center gap-2"><Icon name="gear" /> Security & App Settings</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition text-white/60 hover:text-white"><Icon name="x" size={18} /></button>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-emerald-400 mb-1.5 block font-bold">Two-Factor Authentication (2FA)</label>
          {u.mfaEnabled ? (
            <div className="w-full py-2.5 bg-emerald-500/10 text-emerald-300 font-semibold rounded-xl text-xs border border-emerald-500/30 text-center flex items-center justify-center gap-2">
              <Icon name="shield-check" size={18} /> 2FA is Active on your Vault
            </div>
          ) : !mfaSetup ? (
            <button type="button" onClick={enableMFA} className="w-full py-2.5 bg-emerald-500/20 text-emerald-300 font-semibold rounded-xl text-xs hover:bg-emerald-500/30 transition border border-emerald-500/30 flex items-center justify-center gap-2">
              <Icon name="qr-code" size={18} /> Setup 2FA with Authenticator App (Google / Microsoft / Authy)
            </button>
          ) : (
            <div className="bg-black/50 p-4 rounded-2xl border border-emerald-500/30 text-center space-y-3">
              <span className="text-xs text-emerald-200 block font-serif">Scan QR in Authenticator App:</span>
              <img src={mfaSetup.qr} alt="2FA QR" className="w-36 h-36 mx-auto rounded-xl shadow-lg bg-white p-2" />
              <div className="text-[10px] font-mono t70 select-all bg-black/60 p-2 rounded-lg border border-[#27272a]">Secret: {mfaSetup.secret}</div>
              <form onSubmit={verifyAndSaveMfa} className="space-y-2">
                <input required value={mfaSetup.pin} onChange={(e) => setMfaSetup({ ...mfaSetup, pin: e.target.value })} maxLength="6" placeholder="Enter 6-digit PIN" className="w-full text-center tracking-[0.5em] font-mono font-bold bg-black/60 border border-emerald-500/40 rounded-xl px-3 py-2.5 text-base outline-none text-emerald-300" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setMfaSetup(null)} className="flex-1 py-2 bg-white/10 text-white text-xs rounded-xl hover:bg-white/20">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400">Verify & Activate</button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-blue-400 mb-1.5 block font-bold">Device Passkey / Face Authentication</label>
          <button type="button" disabled={passkeyBusy || !PasskeyAuth?.supported()} onClick={registerPasskey} className="w-full py-2.5 bg-blue-500/15 text-blue-300 font-semibold rounded-xl text-xs hover:bg-blue-500/25 transition border border-blue-500/30 flex items-center justify-center gap-2">
            <Icon name="fingerprint" size={18} /> {passkeyBusy ? "Registering Device..." : passkeyReady ? "Passkey Enabled on This Device" : "Enable Face ID / Passkey"}
          </button>
          {!PasskeyAuth?.supported() && <div className="text-[10px] t50 mt-1">This browser does not provide WebAuthn passkeys.</div>}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-mono uppercase t50 mb-1.5 block">Default Kundali Style</label>
            <select value={localSet.kundaliStyle} onChange={(e) => handleSelectChange("kundaliStyle", e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-xs outline-none text-white">
              <option className="bg-[#09090b] text-white" value="north" >North Indian</option>
              <option className="bg-[#09090b] text-white" value="south" >South Indian</option>
              <option className="bg-[#09090b] text-white" value="east" >East Indian</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-mono uppercase t50 mb-1.5 block">Month System</label>
            <select value={localSet.monthSystem} onChange={(e) => handleSelectChange("monthSystem", e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2 text-xs outline-none text-white">
              <option className="bg-[#09090b] text-white" value="amanta" >Amanta (Amavasya)</option>
              <option className="bg-[#09090b] text-white" value="purnimanta" >Purnimanta (Purnima)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-mono uppercase t50 mb-1.5 block">Primary AI Engine</label>
          <select value={localSet.aiModel || "auto"} onChange={(e) => handleSelectChange("aiModel", e.target.value)} className="w-full bg-black/40 border border-[#27272a] rounded-xl px-3 py-2.5 text-xs outline-none text-white font-medium">
            <option className="bg-[#09090b] text-white" value="auto" >Auto (Smart Load-Balancing & Automatic Fallback)</option>
            <option className="bg-[#09090b] text-white" value="offline" >Offline Vedic Rule Engine (100% Local / Zero API Required)</option>
            <option className="bg-[#09090b] text-white" value="gemini" >Google Gemini 3.8 Flash (Preferred)</option>
            <option className="bg-[#09090b] text-white" value="openai" >OpenAI GPT-4o Mini (Preferred)</option>
            <option className="bg-[#09090b] text-white" value="groq" >Groq (Ultra-Fast Llama 3.1)</option>
            <option className="bg-[#09090b] text-white" value="deepseek" >DeepSeek V3</option>
            <option className="bg-[#09090b] text-white" value="kimi" >Moonshot / Kimi</option>
            <option className="bg-[#09090b] text-white" value="openrouter" >OpenRouter Gateway</option>
            <option className="bg-[#09090b] text-white" value="huggingface" >Hugging Face (Mistral 7B)</option>
          </select>
        </div>

        <div className="p-4 border border-amber-500/30 bg-amber-950/15 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-amber-300 font-mono uppercase font-bold tracking-wider">Multi-Provider AI Fallback Matrix</label>
            <span className="text-[9px] text-amber-200/60 font-mono">Auto-Cascading</span>
          </div>
          <p className="text-[10px] t60 leading-relaxed">
            In <strong>Auto Mode</strong>, queries are load-balanced across all configured keys. If any provider rate limits or exhausts tokens, it cascades to the remaining keys before falling back to Offline.
          </p>

          <div className="space-y-2.5 pt-1">
            <div>
              <div className="flex justify-between text-[9px] t60 mb-0.5 font-mono">
                <span className="text-white font-semibold">Google Gemini API Key</span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline flex items-center gap-1">Get Gemini Key <Icon name="arrow-square-out" size={12} /></a>
              </div>
              <input type="password" value={localSet.apiKeys?.gemini || ""} onChange={(e) => handleKeyChange("gemini", e.target.value)} placeholder="AIzaSy..." className="w-full bg-black/50 border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs outline-none text-white focus:border-amber-400/50 font-mono" />
              {renderTokenUsage("gemini")}
            </div>
            <div>
              <div className="flex justify-between text-[9px] t60 mb-0.5 font-mono">
                <span className="text-white font-semibold">OpenAI API Key</span>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline flex items-center gap-1">Get OpenAI Key <Icon name="arrow-square-out" size={12} /></a>
              </div>
              <input type="password" value={localSet.apiKeys?.openai || ""} onChange={(e) => handleKeyChange("openai", e.target.value)} placeholder="sk-proj-..." className="w-full bg-black/50 border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs outline-none text-white focus:border-amber-400/50 font-mono" />
              {renderTokenUsage("openai")}
            </div>
            <div>
              <div className="flex justify-between text-[9px] t60 mb-0.5 font-mono">
                <span className="text-white font-semibold">Groq API Key (Ultra Fast)</span>
                <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline flex items-center gap-1">Get Groq Key <Icon name="arrow-square-out" size={12} /></a>
              </div>
              <input type="password" value={localSet.apiKeys?.groq || ""} onChange={(e) => handleKeyChange("groq", e.target.value)} placeholder="gsk_..." className="w-full bg-black/50 border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs outline-none text-white focus:border-amber-400/50 font-mono" />
              {renderTokenUsage("groq")}
            </div>
            <div>
              <div className="flex justify-between text-[9px] t60 mb-0.5 font-mono">
                <span className="text-white font-semibold">DeepSeek API Key</span>
                <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline flex items-center gap-1">Get DeepSeek Key <Icon name="arrow-square-out" size={12} /></a>
              </div>
              <input type="password" value={localSet.apiKeys?.deepseek || ""} onChange={(e) => handleKeyChange("deepseek", e.target.value)} placeholder="sk-..." className="w-full bg-black/50 border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs outline-none text-white focus:border-amber-400/50 font-mono" />
              {renderTokenUsage("deepseek")}
            </div>
            <div>
              <div className="flex justify-between text-[9px] t60 mb-0.5 font-mono">
                <span className="text-white font-semibold">Moonshot / Kimi API Key</span>
                <a href="https://platform.moonshot.cn/console/api-keys" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline flex items-center gap-1">Get Kimi Key <Icon name="arrow-square-out" size={12} /></a>
              </div>
              <input type="password" value={localSet.apiKeys?.kimi || ""} onChange={(e) => handleKeyChange("kimi", e.target.value)} placeholder="sk-..." className="w-full bg-black/50 border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs outline-none text-white focus:border-amber-400/50 font-mono" />
              {renderTokenUsage("kimi")}
            </div>
            <div>
              <div className="flex justify-between text-[9px] t60 mb-0.5 font-mono">
                <span className="text-white font-semibold">OpenRouter Gateway Key</span>
                <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline flex items-center gap-1">Get OpenRouter Key <Icon name="arrow-square-out" size={12} /></a>
              </div>
              <input type="password" value={localSet.apiKeys?.openrouter || ""} onChange={(e) => handleKeyChange("openrouter", e.target.value)} placeholder="sk-or-v1-..." className="w-full bg-black/50 border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs outline-none text-white focus:border-amber-400/50 font-mono" />
              {renderTokenUsage("openrouter")}
            </div>
            <div>
              <div className="flex justify-between text-[9px] t60 mb-0.5 font-mono">
                <span className="text-white font-semibold">Hugging Face User Access Token</span>
                <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline flex items-center gap-1">Get HuggingFace Token <Icon name="arrow-square-out" size={12} /></a>
              </div>
              <input type="password" value={localSet.apiKeys?.huggingface || ""} onChange={(e) => handleKeyChange("huggingface", e.target.value)} placeholder="hf_..." className="w-full bg-black/50 border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs outline-none text-white focus:border-amber-400/50 font-mono" />
              {renderTokenUsage("huggingface")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
