const fs = require('fs');
let code = fs.readFileSync('src/js/formulas.js', 'utf8');

code = code.replace(
  /return \{\n\s*d1: genC\(1\),\n\s*d9: genC\(9\),\n\s*kpTable: kpPlanets,\n\s*moonSign: window\.SIGNS\[Math\.floor\(sid\.Moon \/ 30\)\],\n\s*sunSign: window\.SIGNS\[Math\.floor\(sid\.Sun \/ 30\)\],\n/,
  'const calculatedMoon = window.SIGNS[Math.floor(sid.Moon / 30)];\n  const calculatedSun = window.SIGNS[Math.floor(sid.Sun / 30)];\n  const calculatedLagna = genC(1).lagna;\n\n  const d1Chart = genC(1);\n  if (profile.ascOverride) {\n    const overrideAsc = profile.ascOverride.trim();\n    if (window.SIGNS.includes(overrideAsc)) {\n      d1Chart.lagna = overrideAsc;\n    }\n  }\n\n  return {\n    d1: d1Chart,\n    d9: genC(9),\n    kpTable: kpPlanets,\n    moonSign: (profile.moonOverride && window.SIGNS.includes(profile.moonOverride.trim())) ? profile.moonOverride.trim() : calculatedMoon,\n    sunSign: (profile.sunOverride && window.SIGNS.includes(profile.sunOverride.trim())) ? profile.sunOverride.trim() : calculatedSun,\n'
);

fs.writeFileSync('src/js/formulas.js', code);
