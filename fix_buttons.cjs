const fs = require('fs');

const fixFile = (path, days) => {
  let code = fs.readFileSync(path, 'utf8');
  code = code.replace(
    /<\/?button[^>]*>\s*<i className=\{\`ph ph-arrows-clockwise[^<]*<\/i> Refresh Forecast\s*<\/button>/g,
    `<div className="flex flex-col sm:flex-row gap-2">
            <button 
             onClick={() => window.generateICS(pr, ch, ${days})}
             className="text-[10px] uppercase font-bold text-indigo-400 border border-indigo-400/30 rounded-full px-4 py-2 hover:bg-indigo-400/10 transition shadow-lg flex items-center gap-2"
            >
              <i className="ph ph-calendar-plus"></i> Sync to Calendar
            </button>
            <button 
             onClick={() => fetch${days === 7 ? 'Weekly' : 'Monthly'}AI(true)}
             className="text-[10px] uppercase font-bold text-amber-400 border border-amber-400/30 rounded-full px-4 py-2 hover:bg-amber-400/10 transition shadow-lg flex items-center gap-2"
            >
              <i className={\`ph ph-arrows-clockwise \${isLoading ? 'animate-spin' : ''}\`}></i> Refresh Forecast
            </button>
          </div>`
  );
  fs.writeFileSync(path, code);
}

fixFile('src/jsx/tab-week.jsx', 7);
fixFile('src/jsx/tab-month.jsx', 30);
