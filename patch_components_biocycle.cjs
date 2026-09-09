const fs = require('fs');
let c = fs.readFileSync('src/jsx/components.jsx', 'utf8');

c = c.replace(
  /window\.BiocycleWidget = \(\{ dob, targetDate, utcOffset = 5\.5 \}\) => \{/g,
  `window.BiocycleWidget = ({ dob, targetDate, utcOffset = 5.5, ch, pr }) => {`
);

const stateAndRemedies = `  const [checklist, setChecklist] = useState({});

  // Remedies Logic
  const getRemediesForDay = (dayOffset) => {
    const day = new Date(targetDate);
    day.setDate(day.getDate() + dayOffset);
    if (!ch) return null;
    
    const sortedPower = Object.entries(ch.shadbala || {}).sort((a, b) => b[1] - a[1]);
    const weakPlanet = sortedPower[sortedPower.length - 1]?.[0] || "Saturn";
    
    const pK = window.WEEKDAY ? window.WEEKDAY[day.getDay()] : "Sun";
    const rulingPlanet = { Sun: "Sun", Mon: "Moon", Tue: "Mars", Wed: "Mercury", Thu: "Jupiter", Fri: "Venus", Sat: "Saturn" }[pK] || "Sun";
    
    const weakInfo = window.PLANET_INFO?.[weakPlanet] || {};
    const rulerInfo = window.PLANET_INFO?.[rulingPlanet] || {};

    return {
      dateStr: day.toISOString().split('T')[0],
      weakPlanet, rulingPlanet,
      tasks: [
        { id: 'mantra', label: 'Chant Mantra', detail: \`"\${rulerInfo.beej || 'Om'}" (\${rulingPlanet})\`, icon: 'om' },
        { id: 'color', label: 'Wear Color', detail: rulerInfo.color || 'White', icon: 'drop' },
        { id: 'charity', label: 'Donate', detail: weakInfo.charity || 'Food', icon: 'hand-heart' },
        { id: 'action', label: 'Daily Action', detail: rulerInfo.action || 'Meditate', icon: 'sparkle' }
      ]
    };
  };
  const remedies = getRemediesForDay(selectedDay);

  const toggleCheck = (taskId) => {
    if (!remedies) return;
    const key = \`\${pr?.id}_\${remedies.dateStr}\`;
    const updated = { ...checklist };
    if (!updated[key]) updated[key] = {};
    updated[key][taskId] = !updated[key][taskId];
    setChecklist(updated);
  };
`;

c = c.replace(
  /const \[visibleCycles, setVisibleCycles\] = useState\(\{ physical: true, emotional: true, intellectual: true, spiritual: false \}\);/g,
  `const [visibleCycles, setVisibleCycles] = useState({ physical: true, emotional: true, intellectual: true, spiritual: false });
${stateAndRemedies}`
);

const remediesRender = `
      {/* REMEDIES & HABITS TRACKER */}
      {remedies && (
         <div className="mt-6 pt-6 border-t border-[#27272a]">
           <div className="flex justify-between items-end mb-4">
              <div>
                 <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                   <window.Icon name="leaf" /> Daily Remedies (Upayas) & Habits
                 </h3>
                 <p className="text-[10px] text-slate-400 font-sans">
                   Based on today's Hora ruler ({remedies.rulingPlanet}) and your natal weak point ({remedies.weakPlanet}).
                 </p>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shadow-inner">
                 {remedies.dateStr}
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
             {remedies.tasks.map(task => {
                const isChecked = checklist[\`\${pr?.id}_\${remedies.dateStr}\`]?.[task.id];
                return (
                  <div 
                    key={task.id} 
                    onClick={() => toggleCheck(task.id)}
                    className={\`p-3 rounded-2xl border \${isChecked ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-[#09090b] border-[#27272a]'} shadow-md cursor-pointer hover:border-[#3f3f46] transition-all flex items-start gap-3 group\`}
                  >
                     <div className={\`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors \${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500 text-transparent group-hover:border-slate-400'}\`}>
                        <window.Icon name="check" size={12} weight="bold" />
                     </div>
                     <div>
                        <div className={\`text-[10px] uppercase font-bold tracking-widest \${isChecked ? 'text-emerald-400' : 'text-slate-400'}\`}>{task.label}</div>
                        <div className={\`text-xs font-sans mt-0.5 \${isChecked ? 'text-emerald-100' : 'text-white/90'}\`}>{task.detail}</div>
                     </div>
                  </div>
                );
             })}
           </div>
         </div>
      )}
`;

c = c.replace(
  /<div className="mt-3 text-center text-\[10px\] text-slate-500 font-mono">\{selectedDay === 0 \? "Today" : \`\$\{selectedDay > 0 \? "\+" : ""\}\$\{selectedDay\} days\`\} · Physical \{formatScore\(pScore\)\} · Emotional \{formatScore\(eScore\)\} · Intellectual \{formatScore\(iScore\)\} · Spiritual \{formatScore\(sScore\)\}<\/div>\s*<\/div>\s*\);\s*\};/g,
  `<div className="mt-3 text-center text-[10px] text-slate-500 font-mono">{selectedDay === 0 ? "Today" : \`\${selectedDay > 0 ? "+" : ""}\${selectedDay} days\`} · Physical {formatScore(pScore)} · Emotional {formatScore(eScore)} · Intellectual {formatScore(iScore)} · Spiritual {formatScore(sScore)}</div>
${remediesRender}
    </div>
  );
};`
);

fs.writeFileSync('src/jsx/components.jsx', c);
