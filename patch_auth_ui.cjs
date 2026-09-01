const fs = require('fs');
let mod = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

const tLinks = `
<div className="flex justify-between items-center mt-4 flex-wrap gap-2">
  <button type="button" onClick={()=>{setMode(mode==="login"?"signup":"login"); setErr("");}} className="text-[11px] t60 hover:text-white">{mode==="login"?"New User? Quick Sign Up":"Existing User? Sign In"}</button>
  {mode === "login" && <button type="button" onClick={()=>{setMode("reset"); setErr("");}} className="text-[11px] text-amber-400 hover:text-amber-300">Forgot Password?</button>}
  {mode === "reset" && <button type="button" onClick={()=>{setMode("login"); setErr("");}} className="text-[11px] text-amber-400 hover:text-amber-300">Back to Login</button>}
</div>
`;

mod = mod.replace(/<div className="flex justify-between items-center mt-4">[\s\S]*?<\/div>/, tLinks);

const modeHeading = '{mode==="signup"?"Create Account":mode==="reset"?"Reset Password":"Sign In"}';
mod = mod.replace(/\{mode==="signup"\?"Create Account":"Sign In"\}/g, modeHeading);

const modeButton = '{mode==="signup"?"Generate Credentials":mode==="reset"?"Reset Password":"Enter Vault"}';
mod = mod.replace(/\{mode==="signup"\?"Generate Credentials":"Enter Vault"\}/g, modeButton);

fs.writeFileSync('src/jsx/modals.jsx', mod);
