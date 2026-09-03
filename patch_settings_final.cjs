const fs = require('fs');
let c = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

const target = `        <div className="grid grid-cols-2 gap-2">`;
const replace = `        <div className="mt-4 pt-4 border-t border-[#27272a] mb-5">
          <label className="text-[10px] font-mono uppercase text-blue-400 mb-1.5 block font-bold">Device Encryption Keys</label>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Your cloud vault is encrypted end-to-end using local ECDH keys. To access this vault from a new browser or device, you must export your keys from this device and import them on the new one.</p>
          <button type="button" onClick={() => {
            const keys = window.CryptoUtils.exportKeys();
            if(keys) {
              prompt("Copy your Device Encryption Key String (keep this secure!):", keys);
            } else {
              alert("Keys not found on this device. (This is normal if this device is not logged in).");
            }
          }} className="w-full py-2.5 bg-blue-500/20 text-blue-300 font-semibold rounded-xl text-xs hover:bg-blue-500/30 transition border border-blue-500/30 flex items-center justify-center gap-2">
            <Icon name="key" size={16} /> Export Device Keys
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">`;

c = c.replace(target, replace);
fs.writeFileSync('src/jsx/modals.jsx', c);
