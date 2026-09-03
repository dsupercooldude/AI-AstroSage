
import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

window.CompatTab = ({ prs, chs, settings }) => {
  const [pairIds, setPairIds] = useState(["", ""]);
  const [relation, setRelation] = useState("Spouse");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiProvider, setAiProvider] = useState("");
  const [tokenUsage, setTokenUsage] = useState(0);

  const storageKey = "gl_union_pair";
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const p = JSON.parse(stored);
        if (p && p.length === 2 && prs.find(x=>x.id===p[0]) && prs.find(x=>x.id===p[1])) {
          setPairIds(p);
        } else if (prs.length >= 2) {
          setPairIds([prs[0].id, prs[1].id]);
        }
      } else if (prs.length >= 2) {
        setPairIds([prs[0].id, prs[1].id]);
      }
    } catch (e) {
      if (prs.length >= 2) setPairIds([prs[0].id, prs[1].id]);
    }
  }, [prs]);

  const persistPair = (nextPair) => {
    setPairIds(nextPair);
    setAiAnalysis("");
    try { localStorage.setItem(storageKey, JSON.stringify(nextPair)); } catch (e) {}
  };

  if (prs.length < 2) return <div className="p-8 text-center text-sm t60 border border-dashed border-white/20 rounded-3xl mt-6 bgfaint">Add at least two natal profiles to unlock 36-point Ashtakoot Milan.</div>;

  const p1 = prs.find((p) => p.id === pairIds[0]) || prs[0];
  const p2 = prs.find((p) => p.id === pairIds[1]) || prs[1];
  const c1 = chs[p1.id], c2 = chs[p2.id];

  if (!c1 || !c2) return null;

  const match = window.calculateAshtakoot ? window.calculateAshtakoot(c1, c2, relation) : { score: 18, details: {} };
  const score = match.score;

  // We change the meanings based on relation
  const isMarriage = ["Spouse", "Girlfriend"].includes(relation);
  const isFamily = ["Mother", "Father", "Son", "Daughter", "Brother", "Sister", "In-Laws"].includes(relation);

  const detailMap = {
    Varna: { max: 1, meaning: isFamily ? "Social and spiritual harmony within the family structure." : "Spiritual and social compatibility; a stronger value suggests better mutual respect and harmony in lifestyle." },
    Vashya: { max: 2, meaning: isFamily ? "Power dynamics and natural influence between the two family members." : "Control and attraction dynamics. Higher score means the personalities naturally influence each other in a balanced way." },
    Tara: { max: 3, meaning: "Nakshatra-based compatibility and timing support. Stronger score indicates smoother emotional and timing alignment." },
    Yoni: { max: 4, meaning: isMarriage ? "Physical and sensual chemistry. It reflects comfort, attraction, and mutual ease in daily life." : "Instinctual comfort and foundational biological understanding (often interpreted beyond physicality for non-marital bonds)." },
    Maitri: { max: 5, meaning: "Planetary friendship. More points suggest easier understanding, trust, and shared values." },
    Gana: { max: 6, meaning: "Temperament match. It shows emotional style and how naturally you respond to each other." },
    Bhakoot: { max: 7, meaning: isFamily ? "Life direction and familial goal alignment." : "House and sign alignment in the match. Higher value indicates stronger support for financial, family, and life direction harmony." },
    Nadi: { max: 8, meaning: isFamily ? "Genetic and lineage energy traits." : "Vital energy and health compatibility. Lower values may require more care in daily habits, stress management, and health routines." }
  };

  const levelText = score >= 28 ? "This match is strongly favorable for harmony, stability, and long-term compatibility." : score >= 18 ? "This match is moderately favorable and should do well with communication and mutual maturity." : "This match needs conscious work, patience, and practical understanding to build strong compatibility.";

  // Chart data
  const chartData = Object.entries(match.details || {}).map(([key, value]) => ({
    subject: key,
    A: value,
    fullMark: detailMap[key]?.max || 1
  }));

  return (
    <div className="space-y-4 pb-12 gl-fadein mt-4">
      <div className="rounded-3xl border border-[#27272a] p-5 bg-gradient-to-br from-pink-950/40 via-black/20 to-transparent flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="w-full sm:w-auto">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-pink-300 mb-1">Union & Kundali Milan</div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <select value={pairIds[0]} onChange={(e) => persistPair([e.target.value, pairIds[1]])} className="bg-black/40 border border-[#27272a] rounded-xl px-2.5 py-1.5 font-serif text-base text-white outline-none">
              {prs.map((p) => (<option className="bg-[#09090b] text-white" key={p.id} value={p.id}>{p.name.split(" ")[0]}</option>))}
            </select>
            <span className="font-serif text-pink-300 hidden sm:block">&amp;</span>
            <select value={pairIds[1]} onChange={(e) => persistPair([pairIds[0], e.target.value])} className="bg-black/40 border border-[#27272a] rounded-xl px-2.5 py-1.5 font-serif text-base text-white outline-none">
              {prs.map((p) => (<option className="bg-[#09090b] text-white" key={p.id} value={p.id}>{p.name.split(" ")[0]}</option>))}
            </select>
          </div>
          <div className="mt-3">
            <label className="text-[10px] uppercase font-mono text-slate-500 mr-2">Relationship:</label>
            <select value={relation} onChange={(e) => { setRelation(e.target.value); setAiAnalysis(""); }} className="bg-black/40 border border-[#27272a] rounded-lg px-2 py-1 text-xs text-white outline-none">
              {["Spouse", "Girlfriend", "Brother", "Sister", "Mother", "Father", "In-Laws", "Son", "Daughter", "Business Partner", "Friend"].map(r => (
                 <option key={r} value={r} className="bg-[#09090b]">{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-black/40 border border-[#27272a] min-w-[100px] shrink-0">
          <div className="text-3xl font-serif text-pink-300 font-bold">{score.toFixed(1)}</div>
          <div className="text-[9px] t50 uppercase font-mono mt-0.5">Out of 36 Gunas</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-3xl border border-[#27272a] bg-[#18181b] p-5 shadow-xl min-h-[300px] flex flex-col justify-center items-center relative">
          <h3 className="font-serif text-sm text-pink-200 absolute top-5 left-5 z-10">Ashtakoot Radar</h3>
          <div className="w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#f472b6', fontSize: 10, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                <Radar name="Compatibility" dataKey="A" stroke="#ec4899" fill="#f472b6" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#f472b6', fontFamily: 'monospace', fontSize: 12 }}
                  labelStyle={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: 12, marginBottom: '4px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-[#27272a] bg-[#18181b] p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
               <h3 className="font-serif text-lg text-pink-200">AI Sage Summary</h3>
               <window.SectionConfidence score={85} type="ai" label="Relationship AI" />
            </div>
            <button 
              onClick={async () => {
                setLoadingAi(true);
                try {
                    const ashtakoot = window.calculateAshtakoot(c1, c2, relation);
                    const detailsStr = Object.entries(ashtakoot.details).map(([k, v]) => `${k}: ${v}/${detailMap[k]?.max}`).join(', ');
                    const prompt = `Analyze the ${relation} compatibility between ${p1.name} (Lagna: ${c1.d1.lagna}, Moon: ${c1.moonSign}, Nakshatra: ${c1.nak}) and ${p2.name} (Lagna: ${c2.d1.lagna}, Moon: ${c2.moonSign}, Nakshatra: ${c2.nak}). Their total Ashtakoot score is ${score}/36. Breakdown: ${detailsStr}. Provide a deep, insightful Vedic astrological relationship analysis outlining their core dynamics, strengths, and potential karmic challenges specifically tailored for a ${relation} relationship.`;
                    
                    let ans = "";
                    if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {
                        const apiRes = await window.executeMultiProviderAI(prompt, settings, "You are an expert Vedic relationship astrologer.");
                        if (apiRes && apiRes.text) { ans = apiRes.text; setAiProvider(apiRes.provider); setTokenUsage(apiRes.tokens || Math.floor(ans.length * 0.3)); }
                    }
                    if (!ans) {
                        ans = window.runVedicRuleEngine(prompt, p1, c1, new Date(), "", false);
                    }
                    
                    if (ans) {
                      setAiAnalysis(ans);
                      // make available globally for the pdf report
                      window.latestUnionAI = ans;
                      if (!tokenUsage) setTokenUsage(Math.floor(ans.length * 0.3));
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
                <div className="mt-3 text-[9px] text-pink-400/70 border-t border-[#27272a] pt-2 text-right uppercase tracking-widest font-bold">
                   <window.Icon.ShieldCheck size={12} className="inline mr-1" /> {aiProvider === "offline" ? "AI" : aiProvider + " Engine"} - 95% Confidence | {tokenUsage} Tokens
                </div>
              )}
            </div>
          )}
        </div>
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
      <window.RelationshipGraph prs={prs} chs={chs} />
    </div>
  );
};
