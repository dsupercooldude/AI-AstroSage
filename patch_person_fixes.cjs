const fs = require('fs');
let tp = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

// 1. Add Chalit to the kundali title map and the buttons
tp = tp.replace(
  'const chartNames = { d1: "Lagna (D1)", d9: "Navamsha (D9)", d3: "Drekkana (D3)", d7: "Saptamsha (D7)", d10: "Dashamsha (D10)" };',
  'const chartNames = { d1: "Lagna (D1)", chalit: "Bhava Chalit", d9: "Navamsha (D9)", d3: "Drekkana (D3)", d7: "Saptamsha (D7)", d10: "Dashamsha (D10)" };'
);

tp = tp.replace(
  /\{ id: "d1", label: "D1 Lagna" \},/,
  '{ id: "d1", label: "D1 Lagna" },\n    { id: "chalit", label: "Chalit" },'
);

// Fix the activeKundali logic
tp = tp.replace(
  /const activeKundali = ch\[kundaliView\] \|\| ch\.d1;/,
  'const activeKundali = (kundaliView === "chalit" && ch.chalit) ? ch.chalit : (ch[kundaliView] || ch.d1);'
);

// 2. Add Lal Kitaab Summary State
const lkState = `
  const [lkSummary, setLkSummary] = useState("");
  const [loadingLk, setLoadingLk] = useState(false);

  const fetchLkSummary = async () => {
    setLoadingLk(true);
    try {
      const prompt = \`Give a concise 3-sentence Lal Kitaab reading for \${pr.name}, Lagna: \${ch.d1.lagna}, Moon Sign: \${ch.moonSign}. Provide one clear, actionable Lal Kitaab remedy.\`;
      let ans = "";
      if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {
         const res = await window.executeMultiProviderAI(prompt, settings, "You are a concise expert in Lal Kitaab Astrology.");
         if (res && res.text) ans = res.text;
      }
      if (!ans && window.runVedicRuleEngine) {
         ans = window.runVedicRuleEngine(prompt, pr, ch, new Date(), "", false);
      }
      if (!ans) ans = "Lal Kitaab AI unavailable.";
      setLkSummary(ans);
    } catch (e) {}
    setLoadingLk(false);
  };
`;
tp = tp.replace('const fetchAiSummary', lkState + '\n  const fetchAiSummary');


// 3. Render Lal Kitaab and Sankalp
const lkUi = `
        <div className="flex gap-2">
          <button onClick={fetchAiSummary} disabled={loadingAi} className="text-[9px] uppercase tracking-widest font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded hover:bg-indigo-500/20 transition flex items-center justify-center min-w-[120px]">
            {loadingAi ? <i className="ph ph-spinner animate-spin"></i> : "Ask AI Astrologer"}
          </button>
          <button onClick={fetchLkSummary} disabled={loadingLk} className="text-[9px] uppercase tracking-widest font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded hover:bg-amber-500/20 transition flex items-center justify-center min-w-[120px]">
            {loadingLk ? <i className="ph ph-spinner animate-spin"></i> : "Ask Lal Kitaab AI"}
          </button>
        </div>
        {aiSummary && <div className="p-4 bg-indigo-900/20 rounded-2xl border border-indigo-500/30 text-xs text-indigo-100 leading-relaxed font-mono whitespace-pre-wrap relative"><div className="absolute top-2 right-2 text-[9px] text-indigo-400 bg-indigo-900/40 px-1.5 py-0.5 rounded flex items-center gap-1"><i className="ph ph-shield-check"></i> AI Inference</div>{aiSummary}</div>}
        {lkSummary && <div className="p-4 bg-amber-900/20 rounded-2xl border border-amber-500/30 text-xs text-amber-100 leading-relaxed font-mono whitespace-pre-wrap relative"><div className="absolute top-2 right-2 text-[9px] text-amber-400 bg-amber-900/40 px-1.5 py-0.5 rounded flex items-center gap-1"><i className="ph ph-shield-check"></i> AI Inference</div>{lkSummary}</div>}
`;
tp = tp.replace(/<button onClick=\{fetchAiSummary\}[\\s\\S]*?\{aiSummary\}[^<]*<\/div>\}/, lkUi);


// Also add the Sankalp display
const sankalpUi = `
      {sankalp && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-4 text-center font-serif text-amber-200/90 text-sm italic shadow-lg">
          <i className="ph ph-hands-praying text-amber-400/50 mr-2"></i> {sankalp}
        </div>
      )}
`;
tp = tp.replace(/<div className="bg-\[#18181b\] rounded-3xl border border-\[#27272a\] p-6 shadow-2xl space-y-3 transition hover:border-\[#3f3f46\]">/, sankalpUi + '\n      <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl space-y-3 transition hover:border-[#3f3f46]">');


// 4. Merge South and KP
tp = tp.replace(/\{"NORTH", "SOUTH", "EAST", "KP"\}/, '{"NORTH", "SOUTH/KP", "EAST"}');

fs.writeFileSync('src/jsx/tab-person.jsx', tp);
