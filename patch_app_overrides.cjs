const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

const overridesBlock = `
                  <div className="pt-3 border-t border-[#27272a]">
                    <div className="text-[10px] text-amber-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">Astrological Overrides</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Sun Sign</label><input placeholder="Auto" value={formData.sunOverride || ''} onChange={(e) => setFormData({ ...formData, sunOverride: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Moon Sign</label><input placeholder="Auto" value={formData.moonOverride || ''} onChange={(e) => setFormData({ ...formData, moonOverride: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Ascendant</label><input placeholder="Auto" value={formData.ascOverride || ''} onChange={(e) => setFormData({ ...formData, ascOverride: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#27272a]">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">Profile Association</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Related Profile</label>
                        <select value={formData.associatedProfileId || ''} onChange={(e) => setFormData({ ...formData, associatedProfileId: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white appearance-none">
                          <option value="">None</option>
                          {prs.filter(p => p.id !== formData.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Relationship</label>
                        <select value={formData.associatedRelation || ''} onChange={(e) => setFormData({ ...formData, associatedRelation: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white appearance-none">
                          <option value="">Select...</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Partner">Partner</option>
                          <option value="Parent">Parent</option>
                          <option value="Child">Child</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Friend">Friend</option>
                          <option value="Colleague">Colleague</option>
                        </select>
                      </div>
                    </div>
                  </div>
`;

code = code.replace(
  /<div className="pt-3 border-t border-\[\#27272a\]">\s*<div className="text-\[10px\] text-indigo-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">Spiritual Lineage \(Sankalp\)<\/div>/g,
  overridesBlock + '                  <div className="pt-3 border-t border-[#27272a]">\n                    <div className="text-[10px] text-indigo-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">Spiritual Lineage (Sankalp)</div>'
);

fs.writeFileSync('src/jsx/app.jsx', code);
