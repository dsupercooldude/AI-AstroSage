const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const search = `            <button
              onClick={() => setShowAuthModal(true)}
              title="Cloud Sync / Auth"
              className="p-2 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-slate-300 hover:text-white"
            >
              <Icon name="shield-check" size={16} />
            </button>`;

const replace = `            <button
              onClick={() => setShowAuthModal(true)}
              title="Cloud Sync / Auth"
              className="p-2 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-slate-300 hover:text-white"
            >
              <Icon name="shield-check" size={16} />
            </button>

            <button
              onClick={() => setAdminAuthOpen(true)}
              title="Admin Console"
              className="p-2 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-amber-400 hover:text-white"
            >
              <Icon name="shield-warning" size={16} />
            </button>`;

c = c.replace(search, replace);
fs.writeFileSync('src/App.tsx', c);
