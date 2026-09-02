// src/jsx/tab-union.jsx
var React = window.React;
var { useState } = window.React;

window.CompatTab = ({ prs, chs, settings }) => {
  const { NAKSHATRAS } = window;
  const storageKey = 'astrograh_union_pair';
  const initialPair = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(saved) && saved.length === 2 && prs.some(p => p.id === saved[0]) && prs.some(p => p.id === saved[1])) return saved;
    } catch (e) {}
    return prs.length >= 2 ? [prs[0].id, prs[1].id] : [prs[0]?.id, prs[0]?.id];
  };
  const [pairIds, setPairIds] = useState(initialPair);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(null);

  const persistPair = (nextPair) => {
    setPairIds(nextPair);
    try { localStorage.setItem(storageKey, JSON.stringify(nextPair)); } catch (e) {}
  };

  if (prs.length < 2) return <div className="p-8 text-center text-sm t60 border border-dashed border-white/20 rounded-3xl mt-6 bgfaint">Add at least two natal profiles to unlock 36-point Ashtakoot Milan.</div>;

  const p1 = prs.find((p) => p.id === pairIds[0]) || prs[0];
  const p2 = prs.find((p) => p.id === pairIds[1]) || prs[1];
  const c1 = chs[p1.id], c2 = chs[p2.id];

  if (!c1 || !c2) return null;
  const match = window.calculateAshtakoot ? window.calculateAshtakoot(c1, c2) : { score: 18, details: {} };
  const score = match.score;
  const detailMap = {
    Varna: { max: 1, meaning: "Spiritual and social compatibility; a stronger value suggests better mutual respect and harmony in lifestyle." },
    Vashya: { max: 2, meaning: "Control and attraction dynamics. Higher score means the personalities naturally influence each other in a balanced way." },
    Tara: { max: 3, meaning: "Nakshatra-based compatibility and timing support. Stronger score indicates smoother emotional and timing alignment." },
    Yoni: { max: 4, meaning: "Physical and sensual chemistry. It reflects comfort, attraction, and mutual ease in daily life." },
    Maitri: { max: 5, meaning: "Planetary friendship. More points suggest easier understanding, trust, and shared values." },
    Gana: { max: 6, meaning: "Temperament match. It shows emotional style and how naturally you respond to each other." },
    Bhakoot: { max: 7, meaning: "House and sign alignment in the match. Higher value indicates stronger support for financial, family, and life direction harmony." },
    Nadi: { max: 8, meaning: "Vital energy and health compatibility. Lower values may require more care in daily habits, stress management, and health routines." }
  };
  const levelText = score >= 28 ? "This match is strongly favorable for harmony, stability, and long-term compatibility." : score >= 18 ? "This match is moderately favorable and should do well with communication and mutual maturity." : "This match needs conscious work, patience, and practical understanding to build strong compatibility.";

  return (
    <div className="space-y-4 pb-12 gl-fadein mt-4">
      <div className="rounded-3xl border border-[#27272a] p-5 bg-gradient-to-br from-pink-950/40 via-black/20 to-transparent flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-pink-300 mb-1">Union & Kundali Milan</div>
          <div className="flex items-center gap-2">
            <select value={pairIds[0]} onChange={(e) => persistPair([e.target.value, pairIds[1]])} className="bg-black/40 border border-[#27272a] rounded-xl px-2.5 py-1.5 font-serif text-base text-white outline-none">
              {prs.map((p) => (<option className="bg-[#09090b] text-white" key={p.id} value={p.id}>{p.name.split(" ")[0]}</option>))}
            </select>
            <span className="font-serif text-pink-300">&amp;</span>
            <select value={pairIds[1]} onChange={(e) => persistPair([pairIds[0], e.target.value])} className="bg-black/40 border border-[#27272a] rounded-xl px-2.5 py-1.5 font-serif text-base text-white outline-none">
              {prs.map((p) => (<option className="bg-[#09090b] text-white" key={p.id} value={p.id}>{p.name.split(" ")[0]}</option>))}
            </select>
          </div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-black/40 border border-[#27272a] min-w-[100px]">
          <div className="text-3xl font-serif text-pink-300 font-bold">{score.toFixed(1)}</div>
          <div className="text-[9px] t50 uppercase font-mono mt-0.5">Out of 36 Gunas</div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#27272a] bg-[#18181b] p-5 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex justify-between items-center w-full"><h3 className="font-serif text-lg text-pink-200">Deep Relationship Analysis</h3><window.SectionConfidence score={85} type="ai" label="Compatibility AI" /></div>
          <button 
            onClick={async () => {
              setLoadingAi(true);
              try { 
                 const ashtakoot = window.calculateAshtakoot(p1, p2);
                 const details = `Varna: ${ashtakoot.varna}/1, Vashya: ${ashtakoot.vashya}/2, Tara: ${ashtakoot.tara}/3, Yoni: ${ashtakoot.yoni}/4, Graha Maitri: ${ashtakoot.grahaMaitri}/5, Gana: ${ashtakoot.gana}/6, Bhakoot: ${ashtakoot.bhakoot}/7, Nadi: ${ashtakoot.nadi}/8`;
                 const prompt = `Analyze marital compatibility between ${p1.name} (Lagna: ${c1.d1.lagna}, Moon: ${c1.moonSign}, Nakshatra: ${c1.nak}) and ${p2.name} (Lagna: ${c2.d1.lagna}, Moon: ${c2.moonSign}, Nakshatra: ${c2.nak}). Their total Ashtakoot score is ${score}/36. Breakdown: ${details}. Provide a deep, insightful Vedic astrological relationship analysis outlining their core dynamics, strengths, and potential karmic challenges.`;
                 
                 let ans = "";
                 if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {
                     const apiRes = await window.executeMultiProviderAI(prompt, settings, "You are an expert Vedic relationship astrologer.");
                     if (apiRes && apiRes.text) ans = apiRes.text;
                 }
                 if (!ans) {
                     ans = window.runVedicRuleEngine(prompt, p1, c1, new Date(), "", false);
                 }
                 
                 if (ans) {
                   setAiAnalysis(ans);
                   setTokenUsage(Math.floor(ans.length * 0.3));
                 }
              } catch (e) {
                 setAiAnalysis("AI Analysis failed. " + e.message);
              }
              setLoadingAi(false);
            }}
            disabled={loadingAi}
            className="text-[9px] uppercase tracking-widest font-mono bg-pink-500/10 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-xl hover:bg-pink-500/20 transition flex items-center gap-1.5"
          >
            {loadingAi ? <window.Icon name="spinner" className="animate-spin" size={12} /> : <window.Icon name="sparkle" size={12} />}
            {loadingAi ? "Analyzing..." : "Ask AI"}
          </button>
        </div>
        {!aiAnalysis ? (
          <p className="text-sm t85 leading-relaxed font-mono">{levelText}</p>
        ) : (
          <div className="text-sm t85 leading-relaxed font-mono space-y-2 whitespace-pre-wrap">
            {aiAnalysis}
            {tokenUsage && (
              <div className="mt-3 text-[9px] text-pink-400/70 border-t border-[#27272a] pt-2 text-right">
                 ~ {tokenUsage} AI Tokens Used
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(match.details || {}).map(([key, value]) => (
          <div key={key} className="rounded-2xl border border-[#27272a] bg-black/25 p-4 shadow-inner">
            <div className="flex justify-between items-center mb-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-pink-300">{key}</div>
              <div className="font-bold font-mono text-sm text-white">{Number(value).toFixed(1)} / {detailMap[key]?.max ?? 1}</div>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-[#27272a]">
              <div className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300" style={{ width: `${Math.min(100, (Number(value) / (detailMap[key]?.max || 1)) * 100)}%` }}></div>
            </div>
            <p className="text-[10px] t60 mt-2 leading-relaxed font-mono">{detailMap[key]?.meaning || "This factor contributes to the overall match and is reviewed as a part of the overall compatibility profile."}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
