// src/jsx/charts.jsx
var React = window.React;
var { useState } = window.React;

window.KundaliRenderer = ({ ac, ch, kpTable, style, titleDesc, isExpert }) => {
  if (!ac) return <div className="p-4 text-center text-xs t60">No Chart Data Available</div>;

  const st = style.toLowerCase();
  const [hoveredHouse, setHoveredHouse] = React.useState(null);
  
  // Maps planets to the correct house index for drawing
  const getHousePlanets = (h) => {
    return Object.entries(ac.placements || {})
      .filter(([p, houseStr]) => parseInt(houseStr) === parseInt(h))
      .map(([p]) => p);
  };

  // Helper to render the planet with its icon AND 2-letter abbreviation
  const renderPlanet = (p) => (
    <span key={p} style={{ color: window.PLANET_INFO[p]?.color }} className="font-bold flex items-center gap-0.5">
      {window.PLANET_INFO[p]?.symbol} {p.slice(0, 2)}
    </span>
  );

  // House meanings for tooltip context
  const houseMeanings = {
    1: "Self & Personality",
    2: "Wealth & Family",
    3: "Courage & Siblings",
    4: "Home & Mother",
    5: "Children & Creativity",
    6: "Health & Enemies",
    7: "Marriage & Partnerships",
    8: "Longevity & Inheritance",
    9: "Fortune & Guru",
    10: "Career & Public Image",
    11: "Gains & Friendships",
    12: "Losses & Spirituality"
  };

  return (
    <div className="space-y-4 w-full max-w-lg mx-auto">
      <div className="flex flex-col items-center justify-center p-6 bg-black/30 rounded-2xl border border-white/5 shadow-inner">
        <div className="text-center font-serif text-lg text-amber-200 mb-6">{ac.lagna} Lagna Chart</div>

        {/* NORTH INDIAN CHART (DIAMOND SVG) */}
        {st === "north" && (
          <div className="relative w-full max-w-[320px] aspect-square border-2 border-amber-400/50 bg-black/60 rounded p-2">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full stroke-amber-400/40" strokeWidth="0.5" fill="none">
              <line x1="0" y1="0" x2="100" y2="100" /><line x1="100" y1="0" x2="0" y2="100" />
              <polygon points="50,0 100,50 50,100 0,50" />
            </svg>
            <div className="absolute inset-0 font-mono text-[9px] font-bold text-center" onMouseLeave={() => setHoveredHouse(null)}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => {
                const positions = {
                  1: { top: '20%', left: '50%', dx: '-50%', dy: '-50%' },
                  2: { top: '15%', left: '20%', dx: '-50%', dy: '-50%' },
                  3: { top: '20%', left: '15%', dx: '-50%', dy: '0%' },
                  4: { top: '50%', left: '20%', dx: '-50%', dy: '-50%' },
                  5: { top: '80%', left: '15%', dx: '-50%', dy: '0%' },
                  6: { top: '85%', left: '20%', dx: '-50%', dy: '0%' },
                  7: { top: '80%', left: '50%', dx: '-50%', dy: '0%' },
                  8: { top: '85%', right: '20%', dx: '50%', dy: '0%' },
                  9: { top: '80%', right: '15%', dx: '50%', dy: '0%' },
                  10: { top: '50%', right: '20%', dx: '50%', dy: '-50%' },
                  11: { top: '20%', right: '15%', dx: '50%', dy: '0%' },
                  12: { top: '15%', right: '20%', dx: '50%', dy: '-50%' }
                };
                const pos = positions[h];
                const isHovered = hoveredHouse === h;
                return (
                  <div key={h} className="absolute w-16 h-16 flex flex-col items-center justify-center cursor-pointer transition-all" 
                    style={{
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      transform: `translate(${pos.dx}, ${pos.dy})`,
                      opacity: isHovered ? 1 : 0.8,
                      filter: isHovered ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' : 'none'
                    }}
                    onMouseEnter={() => setHoveredHouse(h)}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-400/50">{h}</div>
                    <div className="t50 mb-0.5 text-[7px]">{ac.houses[h].slice(0,3)}</div>
                    <div className="flex flex-wrap justify-center gap-1.5 leading-tight">{getHousePlanets(h).map(renderPlanet)}</div>
                    {isHovered && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[7px] px-2 py-1 rounded whitespace-nowrap border border-white/20">{houseMeanings[h]}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SOUTH INDIAN & KP CHART (GRID) */}
        {(st === "south" || st === "kp") && (
          <div className="grid grid-cols-4 grid-rows-4 w-full max-w-[320px] aspect-square border-2 border-amber-400/50 bg-black/60 rounded" onMouseLeave={() => setHoveredHouse(null)}>
            {[12,1,2,3, 11,null,null,4, 10,null,null,5, 9,8,7,6].map((h, i) => {
              const isHovered = hoveredHouse === h;
              return (
                <div key={i} className={`border border-amber-400/30 p-1 flex flex-col transition-all ${h ? 'cursor-pointer' : 'bg-transparent border-none'} ${isHovered ? 'bg-amber-400/10 border-amber-400/50' : ''}`}
                  onMouseEnter={() => h && setHoveredHouse(h)}
                >
                  {h && (
                    <>
                      <div className="text-[9px] font-mono font-bold text-center text-amber-300 bg-black/40 px-1 py-0.5 rounded mb-1">{h} {h===1 ? '(As)' : ''}</div>
                      <div className="text-[7px] font-mono t50 text-center mb-1">{ac.houses[h].slice(0,3)}</div>
                      <div className="flex-1 flex flex-wrap content-center justify-center gap-1.5 font-mono text-[9px] font-bold mt-1">
                        {getHousePlanets(h).map(renderPlanet)}
                      </div>
                      {isHovered && <div className="text-[7px] text-amber-300 mt-1 bg-black/60 px-1 py-0.5 rounded text-center border border-white/10">{houseMeanings[h]}</div>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* EAST INDIAN FALLBACK */}
        {st === "east" && (
          <div className="grid grid-cols-4 gap-2 z-10 text-[9px] font-mono text-center w-full">
            {Object.entries(ac.houses || {}).map(([houseNum, sign]) => (
              <div key={houseNum} className="p-2 bg-white/5 border border-white/10 rounded-xl min-h-[70px] flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute top-1 left-1.5 text-[8px] t40">{houseNum}</div>
                <div className="absolute top-1 right-1.5 font-bold text-amber-200/50">{sign.substring(0,3).toUpperCase()}</div>
                <div className="mt-4 w-full flex flex-wrap justify-center gap-1.5 leading-tight">
                  {getHousePlanets(houseNum).map(renderPlanet)}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* EXPERT KP TABLE */}
      {isExpert && kpTable && (
        <div className="overflow-x-auto pt-4 gl-fadein w-full">
          <table className="w-full text-[10px] font-mono text-left border-collapse bg-black/40 border border-white/10 rounded-xl shadow-lg">
            <thead>
              <tr className="border-b border-white/10 t50 uppercase"><th className="pb-2 pt-2 pl-3">Planet</th><th className="pb-2 pt-2">Sign</th><th className="pb-2 pt-2">Nakshatra</th><th className="pb-2 pt-2">Sub Lord</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(kpTable).map(([p, info]) => (
                <tr key={p} className="hover:bg-white/5"><td className="py-2 pl-3 font-bold" style={{ color: window.PLANET_INFO[p]?.color }}>{p}</td><td className="py-2 t80">{info.sign}</td><td className="py-2 t80">{info.nak}</td><td className="py-2 text-amber-200">{info.sub}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
