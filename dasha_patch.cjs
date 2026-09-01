const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

code = code.replace(
  'const [expandedDasha, setExpandedDasha] = useState(null);',
  'const [expandedDasha, setExpandedDasha] = useState(null);\n  const [expandedAntar, setExpandedAntar] = useState(null);'
);

code = code.replace(
  /useEffect\(\(\) => \{\s*if \(ch && ch\.dasha\) \{\s*const activeIndex = ch\.dasha\.findIndex\(d => currentYear >= d\.start && currentYear < d\.end\);\s*setExpandedDasha\(activeIndex !== -1 \? activeIndex : 0\);\s*\}\s*\}, \[ch, date\]\);/g,
  `useEffect(() => {
    if (ch && ch.dasha && window.getAntardashas) {
      const activeIndex = ch.dasha.findIndex(d => currentYear >= d.start && currentYear < d.end);
      if (activeIndex !== -1) {
        setExpandedDasha(activeIndex);
        const d = ch.dasha[activeIndex];
        const antars = window.getAntardashas(d.lord, d.start, d.end);
        const aIdx = antars.findIndex(a => currentYear >= a.start && currentYear < a.end);
        setExpandedAntar(aIdx !== -1 ? activeIndex + "-" + aIdx : null);
      } else {
        setExpandedDasha(0);
        setExpandedAntar("0-0");
      }
    }
  }, [ch, date]);`
);

code = code.replace(
  /<div className={`text-\[10px\] font-mono font-bold cursor-pointer hover:opacity-80 transition flex justify-between items-center p-1.5 rounded-lg mb-1 \$\{isAntarActive \? 'text-indigo-400 bg-indigo-500\/10 border border-indigo-500\/20' : 'text-slate-400'\}`\}>/g,
  `<div className={\`text-[10px] font-mono font-bold cursor-pointer hover:opacity-80 transition flex justify-between items-center p-1.5 rounded-lg mb-1 \${isAntarActive ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400'}\`} onClick={() => setExpandedAntar(expandedAntar === (i + "-" + aIdx) ? null : (i + "-" + aIdx))}>`
);

code = code.replace(
  /<div className="pl-4 space-y-1 border-l border-\[\#27272a\] ml-1">/g,
  `{expandedAntar === (i + "-" + aIdx) && (
                          <div className="pl-4 space-y-1 border-l border-[#27272a] ml-1 gl-fadein">`
);

code = code.replace(
  /                                <\/div>\n                              \);\n                            \}\)}\n                          <\/div>/g,
  `                                </div>
                              );
                            })}
                          </div>
                        )}`
);

fs.writeFileSync('src/jsx/tab-person.jsx', code);
