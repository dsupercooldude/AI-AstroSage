const fs = require('fs');

let charts = fs.readFileSync('src/jsx/charts.jsx', 'utf8');

const southCode = `
        {/* SOUTH INDIAN & KP CHART (GRID) */}
        {(st === "south" || st === "kp") && (() => {
          const southGridSigns = ["Pisces", "Aries", "Taurus", "Gemini", "Aquarius", null, null, "Cancer", "Capricorn", null, null, "Leo", "Sagittarius", "Scorpio", "Libra", "Virgo"];
          
          const signToHouse = {};
          if (ac.houses) {
            Object.entries(ac.houses).forEach(([h, s]) => { signToHouse[s] = parseInt(h); });
          }
          
          return (
            <div className="grid grid-cols-4 grid-rows-4 w-full max-w-[320px] aspect-square border-2 border-amber-400/50 bg-black/60 rounded" onMouseLeave={() => setHoveredHouse(null)}>
              {southGridSigns.map((sign, i) => {
                if (!sign) return <div key={i} className="bg-transparent border-none"></div>;
                const h = signToHouse[sign];
                const isHovered = hoveredHouse === h;
                return (
                  <div key={i} className={\`border border-amber-400/30 p-1 flex flex-col transition-all cursor-pointer \${isHovered ? 'bg-amber-400/10 border-amber-400/50' : ''}\`}
                    onMouseEnter={() => h && setHoveredHouse(h)}
                  >
                    <div className="text-[9px] font-mono font-bold text-center text-amber-300 bg-black/40 px-1 py-0.5 rounded mb-1">{sign.slice(0,3)} {h===1 ? '(Lg)' : ''}</div>
                    <div className="flex-1 flex flex-wrap content-center justify-center gap-1.5 font-mono text-[9px] font-bold mt-1">
                      {h && getHousePlanets(h).map(renderPlanet)}
                    </div>
                    {isHovered && h && <div className="text-[7px] text-amber-300 mt-1 bg-black/60 px-1 py-0.5 rounded text-center border border-white/10">{houseMeanings[h]}</div>}
                  </div>
                );
              })}
            </div>
          );
        })()}
`;

charts = charts.replace(
  /\{\/\* SOUTH INDIAN & KP CHART \(GRID\) \*\/\}(.|\n)*?\{\/\* EAST INDIAN FALLBACK \*\/\}/m,
  southCode + "\n        {/* EAST INDIAN FALLBACK */}"
);

fs.writeFileSync('src/jsx/charts.jsx', charts);
