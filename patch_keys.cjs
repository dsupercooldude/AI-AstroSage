const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

c = c.replace(
  'const [mfaSetup, setMfaSetup] = useState(null);',
  'const [mfaSetup, setMfaSetup] = useState(null); const [exportKeyStr, setExportKeyStr] = useState("");'
);

const target = `<button type="button" onClick={() => {
            const keys = window.CryptoUtils.exportKeys();
            if(keys) {
              prompt("Copy your Device Encryption Key String (keep this secure!):", keys);
            } else {
              alert("Keys not found on this device. (This is normal if this device is not logged in).");
            }
          }} className="w-full py-2.5 bg-blue-500/20 text-blue-300 font-semibold rounded-xl text-xs hover:bg-blue-500/30 transition border border-blue-500/30 flex items-center justify-center gap-2">
            <Icon name="key" size={16} /> Export Device Keys
          </button>`;

const replacement = `<button type="button" onClick={() => {
            const keys = window.CryptoUtils.exportKeys();
            if(keys) {
              setExportKeyStr(keys);
            } else {
              setExportKeyStr("NOT_FOUND");
            }
          }} className="w-full py-2.5 bg-blue-500/20 text-blue-300 font-semibold rounded-xl text-xs hover:bg-blue-500/30 transition border border-blue-500/30 flex items-center justify-center gap-2">
            <Icon name="key" size={16} /> Export Device Keys
          </button>
          
          {exportKeyStr === "NOT_FOUND" && (
            <div className="mt-2 text-xs text-red-400 p-2 bg-red-900/20 border border-red-500/30 rounded text-center">Keys not found on this device.</div>
          )}
          
          {exportKeyStr && exportKeyStr !== "NOT_FOUND" && (
            <div className="mt-3 p-3 bg-black/60 border border-blue-500/40 rounded-xl space-y-2">
              <span className="text-[10px] text-blue-300 block font-bold">Copy this entire string:</span>
              <textarea readOnly value={exportKeyStr} className="w-full h-24 bg-[#09090b] border border-[#27272a] rounded-lg p-2 text-[10px] font-mono text-slate-300 outline-none resize-none break-all" onFocus={(e) => e.target.select()}></textarea>
              <button type="button" onClick={(e) => { navigator.clipboard.writeText(exportKeyStr).catch(()=>console.log("Clipboard blocked")); e.target.innerText = "Copied!"; setTimeout(()=>e.target.innerText="Copy to Clipboard", 2000); }} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition">Copy to Clipboard</button>
            </div>
          )}`;

c = c.replace(target, replacement);
fs.writeFileSync('src/jsx/modals.jsx', c);
