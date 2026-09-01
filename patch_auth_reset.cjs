const fs = require('fs');
let mod = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

const tSubmit = `
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
        const hashedInput = await CryptoUtils.hashPassword(p); if(u.p !== p && u.p !== hashedInput) throw new Error("Invalid password."); 
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
`;

mod = mod.replace(/const handleSubmit = async \(ev\) => \{[\s\S]*?\}\s*catch\(error\) \{ setErr\(error\.message\); \}\s*\};/, tSubmit);

fs.writeFileSync('src/jsx/modals.jsx', mod);
