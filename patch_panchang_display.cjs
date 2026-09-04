const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

c = c.replace(
  /<span className="text-indigo-100 font-bold text-base font-serif">\{pan\.paksha \|\| ""\} \{pan\.tithi \|\| "—"\}<\/span>/,
  `<span className="text-indigo-100 font-bold text-base font-serif">{apiData?.tithi || (pan.paksha + " " + pan.tithi)}</span>`
);

// We need to show Choghadiya and Hora online validation if apiData exists
c = c.replace(
  /<h3 className="font-serif text-sm text-amber-200 flex items-center gap-2"><span>Choghadiya Windows<\/span>/,
  `<h3 className="font-serif text-sm text-amber-200 flex items-center gap-2"><span>Choghadiya Windows {apiData?.choghadiya ? "(Live Validated)" : ""}</span>`
);

c = c.replace(
  /<h3 className="font-serif text-sm text-amber-200 mb-4 flex justify-between items-center w-full"><span>Planetary Hora Tracking \(24H\)<\/span>/,
  `<h3 className="font-serif text-sm text-amber-200 mb-4 flex justify-between items-center w-full"><span>Planetary Hora Tracking (24H) {apiData?.hora ? "(Live Validated)" : ""}</span>`
);

fs.writeFileSync('src/jsx/tab-panchang.jsx', c);
