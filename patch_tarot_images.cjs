const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

c = c.replace(
/className="w-32 h-48 rounded-xl border border-indigo-400 bg-indigo-900\/30 cursor-pointer hover:border-red-500\/50 transition flex flex-col items-center justify-center p-3 text-center shadow-\[0_0_15px_rgba\(99,102,241,0\.2\)\]"[\s\S]*?<\/div>/,
`className={\`w-32 h-48 rounded-xl border border-indigo-400 bg-indigo-900/30 cursor-pointer hover:border-red-500/50 transition flex flex-col items-center justify-center p-3 text-center shadow-[0_0_15px_rgba(99,102,241,0.2)] relative overflow-hidden \${selectedMajor.reversed ? 'rotate-180' : ''}\`}
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity" style={{ backgroundImage: \`url('https://image.pollinations.ai/prompt/Tarot%20card%20\${encodeURIComponent(selectedMajor.name)}%20mystical%20illustration?width=256&height=384&nologo=true')\` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                <div className={\`relative z-10 flex flex-col items-center \${selectedMajor.reversed ? 'rotate-180' : ''}\`}>
                  <span className="font-serif text-sm text-indigo-100 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{selectedMajor.name}</span>
                  <span className="text-[9px] font-mono text-indigo-300 uppercase mt-1 tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{selectedMajor.reversed ? 'Reversed' : 'Upright'}</span>
                </div>
              </div>`
);

c = c.replace(
/className="w-32 h-48 rounded-xl border border-pink-400 bg-pink-900\/30 cursor-pointer hover:border-red-500\/50 transition flex flex-col items-center justify-center p-3 text-center shadow-\[0_0_15px_rgba\(236,72,153,0\.2\)\]"[\s\S]*?<\/div>/,
`className={\`w-32 h-48 rounded-xl border border-pink-400 bg-pink-900/30 cursor-pointer hover:border-red-500/50 transition flex flex-col items-center justify-center p-3 text-center shadow-[0_0_15px_rgba(236,72,153,0.2)] relative overflow-hidden \${selectedMinor.reversed ? 'rotate-180' : ''}\`}
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity" style={{ backgroundImage: \`url('https://image.pollinations.ai/prompt/Tarot%20card%20\${encodeURIComponent(selectedMinor.name)}%20mystical%20illustration?width=256&height=384&nologo=true')\` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                <div className={\`relative z-10 flex flex-col items-center \${selectedMinor.reversed ? 'rotate-180' : ''}\`}>
                  <span className="font-serif text-sm text-pink-100 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{selectedMinor.name}</span>
                  <span className="text-[9px] font-mono text-pink-300 uppercase mt-1 tracking-wider drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{selectedMinor.reversed ? 'Reversed' : 'Upright'}</span>
                </div>
              </div>`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
