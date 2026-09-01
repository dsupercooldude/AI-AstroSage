const fs = require('fs');
let tab = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

tab = tab.replace(
  'const [kundaliView, setKundaliView] = useState("birth");',
  'const [kundaliView, setKundaliView] = useState("d1");'
);

tab = tab.replace(
  'const activeKundali = kundaliView === "chalit" ? (ch.d9 || ch.d1) : ch.d1;',
  'const activeKundali = ch[kundaliView] || ch.d1;'
);

tab = tab.replace(
  'const kundaliTitle = kundaliView === "chalit" ? "Chalit Kundali" : "Birth Kundali";',
  'const chartNames = { d1: "Lagna (D1)", d9: "Navamsha (D9)", d3: "Drekkana (D3)", d7: "Saptamsha (D7)", d10: "Dashamsha (D10)" };\n  const kundaliTitle = chartNames[kundaliView] || "Kundali";'
);

tab = tab.replace(
  /\[\s*\{ id: "birth", label: "Birth Kundali" \},\s*\{ id: "chalit", label: "Chalit Kundali" \}\s*\]/,
  `[
    { id: "d1", label: "D1 Lagna" },
    { id: "d9", label: "D9 Navamsha" },
    { id: "d3", label: "D3 Drekkana" },
    { id: "d7", label: "D7 Saptamsha" },
    { id: "d10", label: "D10 Dashamsha" }
  ]`
);

fs.writeFileSync('src/jsx/tab-person.jsx', tab);
