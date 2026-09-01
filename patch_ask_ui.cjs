const fs = require('fs');
let askStr = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

const summaryUI = `
      {/* Learned Rules Summary */}
      <div className="mx-auto w-full max-w-3xl mb-6">
        <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-2xl flex flex-col gap-2">
          <div className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
            <i className="ph ph-brain"></i> AI Profile Pattern Summary
          </div>
          <div className="text-[11px] font-mono text-indigo-200/70 leading-relaxed">
            {window.getOfflineRules && window.getOfflineRules().length > 0 
              ? <ul className="list-disc pl-4 space-y-1">{window.getOfflineRules().map((r,i) => <li key={i}>{r}</li>)}</ul>
              : "No learned patterns yet. Chat with the Sage to personalize your experience."}
          </div>
        </div>
      </div>
`;

askStr = askStr.replace('{/* MESSAGES */}', summaryUI + '\n      {/* MESSAGES */}');

fs.writeFileSync('src/jsx/tab-ask.jsx', askStr);
