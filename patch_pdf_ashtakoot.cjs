const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const ashtakootTarget = `<div className="grid grid-cols-2 gap-4">
                        {Object.entries(ashtakoot.details).map(([param, points]) => (
                          <div key={param} className="bg-black/30 p-4 rounded-xl border border-[#27272a]">
                            <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">{param}</div>
                            <div className="font-bold text-amber-200 text-lg">{Number(points).toFixed(1)}</div>
                          </div>
                        ))}
                      </div>`;

const ashtakootReplacement = `                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(ashtakoot.details).map(([param, points]) => {
                           const detailMap = {
                              Varna: { max: 1, meaning: "Spiritual and social compatibility; mutual respect and harmony in lifestyle." },
                              Vashya: { max: 2, meaning: "Control and attraction dynamics. High score means personalities naturally influence each other." },
                              Tara: { max: 3, meaning: "Nakshatra-based compatibility and timing support. Emotional and timing alignment." },
                              Yoni: { max: 4, meaning: "Physical chemistry and instinctual comfort. Mutual ease in daily life." },
                              Maitri: { max: 5, meaning: "Planetary friendship. Easier understanding, trust, and shared values." },
                              Gana: { max: 6, meaning: "Temperament match. Emotional style and how naturally you respond to each other." },
                              Bhakoot: { max: 7, meaning: "House and sign alignment. Support for financial, family, and life direction harmony." },
                              Nadi: { max: 8, meaning: "Vital energy and health compatibility. Lower values require more care in daily habits." }
                           };
                           return (
                             <div key={param} className="bg-black/30 p-4 rounded-xl border border-[#27272a]">
                               <div className="flex justify-between items-center mb-1">
                                 <div className="text-xs text-white/60 uppercase font-mono tracking-widest">{param}</div>
                                 <div className="font-bold text-amber-200 text-lg">{Number(points).toFixed(1)} / {detailMap[param]?.max || 1}</div>
                               </div>
                               <p className="text-[10px] text-white/70 font-mono leading-relaxed mt-2">{detailMap[param]?.meaning || ""}</p>
                             </div>
                           );
                        })}
                      </div>`;

c = c.replace(ashtakootTarget, ashtakootReplacement);
fs.writeFileSync('src/jsx/pdf-report.jsx', c);
