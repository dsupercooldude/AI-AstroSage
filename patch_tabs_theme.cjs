const fs = require('fs');
let tabs = fs.readFileSync('src/jsx/tabs.jsx', 'utf8');

const tMap = `
  const themeMap = {
    person: "from-indigo-950/20 via-black to-slate-950",
    reports: "from-blue-950/20 via-black to-cyan-950/10",
    panchang: "from-amber-950/20 via-black to-orange-950/10",
    union: "from-pink-950/20 via-black to-rose-950/10",
    palmistry: "from-violet-950/20 via-black to-purple-950/10",
    tarot: "from-emerald-950/20 via-black to-teal-950/10",
    week: "from-indigo-950/20 via-black to-blue-950/10",
    month: "from-slate-900/30 via-black to-slate-950",
    ask: "from-fuchsia-950/20 via-black to-indigo-950/10"
  };
  const activeTheme = themeMap[tb] || "from-black via-black to-black";
`;

tabs = tabs.replace('const [tb, setTb] = useState("person");', 'const [tb, setTb] = useState("person");\n' + tMap);

const tWrap1 = `
    <Fragment>
      <div className={\`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 \${activeTheme}\`}></div>
      {/* Bento Navigation Bar */}
`;
tabs = tabs.replace('<Fragment>\n      {/* Bento Navigation Bar */}', tWrap1);

// Improve the active tab styling using the theme colors loosely
tabs = tabs.replace(
  'tb === t.id\n                ? "bg-white text-black font-bold shadow-lg shadow-white/10"\n                : "text-slate-400 hover:text-white hover:bg-[#27272a]/50"',
  'tb === t.id ? "bg-white text-black font-bold shadow-lg shadow-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"'
);

fs.writeFileSync('src/jsx/tabs.jsx', tabs);
