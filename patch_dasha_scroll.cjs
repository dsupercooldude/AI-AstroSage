const fs = require('fs');
let tp = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

tp = tp.replace(
  /const \[expandedAntar, setExpandedAntar\] = useState\(null\);/,
  'const [expandedAntar, setExpandedAntar] = useState(null);\n  const activeDashaRef = useRef(null);'
);

tp = tp.replace(
  /if \(activeAntarIndex !== -1\) \{\n\s*setExpandedAntar\(activeIndex \+ "-" \+ activeAntarIndex\);\n\s*\}/,
  `if (activeAntarIndex !== -1) {
          setExpandedAntar(activeIndex + "-" + activeAntarIndex);
        }
        setTimeout(() => {
          if (activeDashaRef.current) {
            activeDashaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);`
);

tp = tp.replace(
  /return \(\n\s*<div key=\{i\} className=\{\`border rounded-2xl p-3\.5 transition-all \$\{isActive \? 'bg-indigo-500\/10 border-indigo-500\/30' : 'bg-\[#09090b\] border-\[#27272a\]'\}\`\}>/,
  `return (
                <div ref={isActive ? activeDashaRef : null} key={i} className={\`border rounded-2xl p-3.5 transition-all \${isActive ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-[#09090b] border-[#27272a]'}\`}>`
);

fs.writeFileSync('src/jsx/tab-person.jsx', tp);
