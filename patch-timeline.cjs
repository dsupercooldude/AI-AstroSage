const fs = require('fs');
let content = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

const timelineHelper = `
  const getTimelineData = () => {
    if (!ch || !ch.dasha || !window.getAntardashas) return null;
    const activeD = ch.dasha.find(d => currentYear >= d.start && currentYear < d.end);
    if (!activeD) return null;
    return {
      mahadasha: activeD,
      antardashas: window.getAntardashas(activeD.lord, activeD.start, activeD.end)
    };
  };
  const timelineData = getTimelineData();
`;

// Insert the helper right before return (
content = content.replace('  return (', timelineHelper + '\n  return (');

const timelineJSX = `
          {timelineData && (
            <div className="mb-6 p-4 bg-[#09090b] rounded-2xl border border-[#27272a] overflow-hidden">
              <div className="text-[9px] uppercase font-mono tracking-widest text-slate-500 mb-3 flex items-center justify-between">
                <span>Active Mahadasha Timeline: <span className="text-indigo-400 font-bold">{timelineData.mahadasha.lord}</span></span>
                <span>{Math.floor(timelineData.mahadasha.start)} - {Math.floor(timelineData.mahadasha.end)}</span>
              </div>
              <div className="overflow-x-auto beauty-scroll pb-4 -mb-4">
                <div className="flex items-center min-w-max gap-1.5 px-1 py-2">
                  {timelineData.antardashas.map((antar, idx) => {
                    const isActive = currentYear >= antar.start && currentYear < antar.end;
                    const isPast = currentYear >= antar.end;
                    const duration = antar.end - antar.start;
                    const w = Math.max(60, Math.min(120, duration * 30)); 
                    return (
                      <div key={idx} style={{ width: \`\${w}px\` }} className={\`relative flex flex-col items-center justify-center h-12 rounded-xl border transition-all \${
                        isActive ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] z-10 scale-110' :
                        isPast ? 'bg-[#121214] border-[#27272a] text-slate-600' :
                        'bg-[#18181b] border-[#27272a] text-slate-400 opacity-90'
                      }\`}>
                        <div className="text-[10px] font-bold font-mono uppercase">{antar.lord}</div>
                        <div className="text-[8px] font-mono mt-0.5 opacity-80">{Math.floor(antar.start)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
`;

content = content.replace('<div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"', timelineJSX + '          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"');

fs.writeFileSync('src/jsx/tab-person.jsx', content);
