const fs = require('fs');

const fixFile = (path, days) => {
  let code = fs.readFileSync(path, 'utf8');
  const target = `<button \n             onClick={() => fetch${days === 7 ? 'Weekly' : 'Monthly'}AI(true)}\n            className="text-[10px] uppercase font-bold text-amber-400 border border-amber-400/30 rounded-full px-4 py-2 hover:bg-amber-400/10 transition shadow-lg flex items-center gap-2"\n          >\n            <i className={\`ph ph-arrows-clockwise \${isLoading ? 'animate-spin' : ''}\`}></i> Refresh Forecast\n          </button>`;

  const replacement = `<div className="flex flex-col sm:flex-row gap-2">\n            <button \n             onClick={() => window.generateICS(pr, ch, ${days})}\n             className="text-[10px] uppercase font-bold text-indigo-400 border border-indigo-400/30 rounded-full px-4 py-2 hover:bg-indigo-400/10 transition shadow-lg flex items-center gap-2"\n            >\n              <i className="ph ph-calendar-plus"></i> Sync to Calendar\n            </button>\n            <button \n             onClick={() => fetch${days === 7 ? 'Weekly' : 'Monthly'}AI(true)}\n             className="text-[10px] uppercase font-bold text-amber-400 border border-amber-400/30 rounded-full px-4 py-2 hover:bg-amber-400/10 transition shadow-lg flex items-center gap-2"\n            >\n              <i className={\`ph ph-arrows-clockwise \${isLoading ? 'animate-spin' : ''}\`}></i> Refresh Forecast\n            </button>\n          </div>`;
  
  code = code.replace(target, replacement);
  fs.writeFileSync(path, code);
}

fixFile('src/jsx/tab-week.jsx', 7);
fixFile('src/jsx/tab-month.jsx', 30);
