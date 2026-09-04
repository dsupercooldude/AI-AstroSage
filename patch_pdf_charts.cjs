const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const targetPage2 = `{/* PAGE 2: ASTROLOGICAL CHARTS & BIORHYTHMS   */}
      {/* ========================================== */}
      <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Astrological Charts & Energy Cycles</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[350px]">
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d1} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="North Indian (Diamond)" />}
          </div>
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[350px]">
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d1} ch={ch} kpTable={null} style="SOUTH" isExpert={false} titleDesc="South Indian (Grid)" />}
          </div>
        </div>

        <div className="bg-[#121426] p-8 rounded-2xl border border-[#27272a]">`;

const replacementPage2 = `{/* PAGE 2: ASTROLOGICAL CHARTS & BIORHYTHMS   */}
      {/* ========================================== */}
      <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Primary Birth Chart (Lagna)</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[350px]">
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d1} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="North Indian (Lagna)" />}
          </div>
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[350px]">
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d1} ch={ch} kpTable={null} style="SOUTH" isExpert={false} titleDesc="South Indian (Lagna)" />}
          </div>
        </div>

        <div className="bg-[#121426] p-8 rounded-2xl border border-[#27272a]">`;

const page2B = `{/* PAGE 2B: SECONDARY CHARTS */}
      <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Secondary Alignments (D9 & Chalit)</h3>
        
        <div className="grid grid-cols-1 gap-6 mb-10">
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[380px]">
            <h4 className="text-amber-200 text-lg mb-2 font-serif border-b border-[#27272a] pb-1 w-full text-center">Navamsha Chart (D9 - Soul/Marriage)</h4>
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d9} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="Navamsha D9" />}
          </div>
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[380px]">
            <h4 className="text-amber-200 text-lg mb-2 font-serif border-b border-[#27272a] pb-1 w-full text-center">Bhava Chalit (Practical Reality)</h4>
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.chalit} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="Bhava Chalit" />}
          </div>
        </div>
      </div>
`;

c = c.replace(targetPage2, replacementPage2);

// Insert Page 2B after Page 2
c = c.replace(
  /<\/div>\s*\{\/\* PAGE 3: PLANETARY ALIGNMENTS \*\/\}/s,
  `</div>
      
      ${page2B}
      
      {/* PAGE 3: PLANETARY ALIGNMENTS */}`
);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
