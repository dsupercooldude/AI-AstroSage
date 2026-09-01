const fs = require('fs');
let tab = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

const summaryState = `
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchAiSummary = async () => {
    setLoadingAi(true);
    try {
      const prompt = \`Give a concise 3-sentence Jyotish astrological summary for \${pr.name}, Lagna: \${ch.d1.lagna}, Moon Sign: \${ch.moonSign}. Highlight their core strength and current focus based on transits.\`;
      let ans = "";
      if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {
         const res = await window.executeMultiProviderAI(prompt, settings, "You are a concise expert Vedic Astrologer.");
         if (res && res.text) ans = res.text;
      }
      if (!ans) {
         ans = window.runVedicRuleEngine(prompt, pr, ch, date, "", false);
      }
      setAiSummary(ans);
    } catch (e) {
      setAiSummary("AI Summary unavailable.");
    }
    setLoadingAi(false);
  };
`;

tab = tab.replace(
  'const [kundaliView, setKundaliView] = useState("d1");',
  'const [kundaliView, setKundaliView] = useState("d1");\n' + summaryState
);

const summaryUI = `
          {/* AI Summary Block */}
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-indigo-300 font-bold font-mono text-[11px] uppercase tracking-widest flex items-center gap-2">
                <i className="ph ph-sparkle"></i> AI Chart Overview
              </h4>
              {!aiSummary && !loadingAi && (
                <button onClick={fetchAiSummary} className="text-[10px] bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 px-2 py-1 rounded transition">
                  Generate
                </button>
              )}
            </div>
            {loadingAi && <div className="text-[10px] text-indigo-400/70 font-mono animate-pulse">Consulting the Oracle...</div>}
            {aiSummary && <div className="text-xs text-indigo-100/90 font-mono leading-relaxed bg-black/30 p-3 rounded-lg border border-indigo-500/20">{aiSummary}</div>}
          </div>
`;

tab = tab.replace(
  '{/* CHART STYLE CONTROLS */}',
  summaryUI + '\n          {/* CHART STYLE CONTROLS */}'
);

fs.writeFileSync('src/jsx/tab-person.jsx', tab);

let pdf = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const pdfAiSummary = `
      {/* AI Summary in PDF */}
      <div className="mt-8 bg-black/20 p-6 rounded-2xl border border-amber-500/30 relative">
        <div className="absolute -top-3 left-6 bg-[#0b0d19] px-2 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest border border-amber-500/30 rounded">AI Oracle Synthesis</div>
        <p className="text-sm font-mono text-amber-100/90 leading-relaxed">
          {window.runVedicRuleEngine("Provide a deep life synthesis", profile, ch, date, "", false).replace(/#/g, '').replace(/\\*/g, '')}
        </p>
      </div>
`;

pdf = pdf.replace(
  '{/* QUICK BIO-RHYTHM STRIP */}',
  pdfAiSummary + '\n        {/* QUICK BIO-RHYTHM STRIP */}'
);

fs.writeFileSync('src/jsx/pdf-report.jsx', pdf);

