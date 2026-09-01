const fs = require('fs');
let pan = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

// Remove validateLivePanchang logic
pan = pan.replace(/const \[validating, setValidating\] = useState\(false\);/, '');
pan = pan.replace(/const validateLivePanchang = async \(\) => \{[\s\S]*?\}\s*catch \(\) \{\s*\}\s*\};\n/, '');

// Replace the button area with a moon phase visual representation
const moonVisual = `
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="relative w-12 h-12 rounded-full border border-indigo-500/30 overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.2)]" style={{ background: '#0f172a' }}>
            <div className="absolute top-0 bottom-0 left-0 right-0 rounded-full bg-slate-200" style={{ 
               clipPath: window.formulas?.calculateMoonPhase ? \`circle(\${Math.max(10, (1 - Math.abs(window.formulas.calculateMoonPhase(pr, date).degree - 180)/180) * 100)}% at 50% 50%)\` : 'circle(50% at 50% 50%)',
               opacity: 0.9, filter: 'blur(1px)'
            }}></div>
          </div>
          <div className="text-[10px] font-mono text-indigo-300">Phase Visual</div>
        </div>
`;

pan = pan.replace(/<div className="flex flex-col items-end gap-3">[\s\S]*?<\/div>/, moonVisual);

fs.writeFileSync('src/jsx/tab-panchang.jsx', pan);
