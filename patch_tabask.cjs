const fs = require('fs');
let ask = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

ask = ask.replace(
  'const [q, setQ] = useState("");',
  'const [q, setQ] = useState("");\n  const [shareData, setShareData] = useState(true);'
);

ask = ask.replace(
  'if (!q.trim() || l) return;',
  `if (!q.trim() || l) return;
    if (window.updateOfflineRules) window.updateOfflineRules(q.trim(), "");`
);

const sysCtxRegex = /const systemContext = `.*?`;/;
const newSysCtx = `
      let systemContext = \`You are the Graha Ledger Jyotish Sage.\`;
      if (shareData) {
        systemContext += \` Use only the profile-specific context provided by the user and the current chart context. Never mix another profile's data into the answer. For \${pr?.name || "Native"} (Asc: \${ch?.d1?.lagna || "Aries"}, Moon: \${ch?.moonSign || "Aries"}, Gender: \${pr?.gender || "not provided"}). Target Date: \${date.toDateString()}. Today Hora: \${WEEKDAY[date.getDay()]}. Prior requested context: \${relevantContext || "none"}.\`;
        if (window.getOfflineRules) systemContext += \` Learned user patterns: \${window.getOfflineRules().join(" | ")}.\`;
      } else {
        systemContext += \` Data Privacy (Chinese Wall) is active. Do NOT reference the user's specific natal chart, placements, or profile data unless they explicitly provide it in their prompt. Answer generically but expertly. Target Date: \${date.toDateString()}. Prior context: \${relevantContext || "none"}.\`;
        if (window.getOfflineRules) systemContext += \` You may leverage learned user patterns: \${window.getOfflineRules().join(" | ")}.\`;
      }
`;

ask = ask.replace(sysCtxRegex, newSysCtx);

ask = ask.replace(
  'ans = window.runVedicRuleEngine(filteredPrompt, pr, ch, date, relevantContext);',
  'ans = window.runVedicRuleEngine(filteredPrompt, pr, ch, date, relevantContext, !shareData);'
);

ask = ask.replace(
  '<input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask the Oracle (e.g., What does Saturn in 5th house mean?)" className="flex-1 bg-transparent text-amber-50 placeholder-slate-500 font-mono text-sm outline-none px-2" />',
  `
  <div className="flex-1 flex flex-col justify-center">
    <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask the Oracle..." className="w-full bg-transparent text-amber-50 placeholder-slate-500 font-mono text-sm outline-none px-2 mb-2" />
    <label className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono px-2 cursor-pointer w-max">
      <input type="checkbox" checked={shareData} onChange={(e) => setShareData(e.target.checked)} className="accent-indigo-500" />
      <span>Share profile context (Chinese Wall)</span>
    </label>
  </div>
  `
);

fs.writeFileSync('src/jsx/tab-ask.jsx', ask);
