const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const page2C = `{/* PAGE 2C: EXTRA SECONDARY CHARTS */}
      <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Secondary Alignments (D10, D7, D5)</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[350px]">
            <h4 className="text-amber-200 text-sm mb-2 font-serif border-b border-[#27272a] pb-1 w-full text-center">Dashamsha (D10 - Career)</h4>
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d10} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="Dashamsha D10" />}
          </div>
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[350px]">
            <h4 className="text-amber-200 text-sm mb-2 font-serif border-b border-[#27272a] pb-1 w-full text-center">Saptamsha (D7 - Creativity/Children)</h4>
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d7} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="Saptamsha D7" />}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#121426] p-5 rounded-2xl border border-[#27272a] flex flex-col items-center justify-center min-h-[350px]">
            <h4 className="text-amber-200 text-sm mb-2 font-serif border-b border-[#27272a] pb-1 w-full text-center">Panchamsha (D5 - Authority/Power)</h4>
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d5} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="Panchamsha D5" />}
          </div>
        </div>
      </div>`;

c = c.replace(
  /\$\{page2C\}/s,
  page2C
);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
