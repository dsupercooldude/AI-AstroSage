// src/jsx/tab-person.jsx
var React = window.React;
var { useState, useEffect, useRef } = window.React;

window.PersonTab = ({ pr, ch, date, setDate, settings, bioScores, onEdit, onPdf }) => {
  const [chartStyle, setChartStyle] = useState(() => (settings?.kundaliStyle || "north").toUpperCase());
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [expandedDasha, setExpandedDasha] = useState(null);
  const [expandedAntar, setExpandedAntar] = useState(null);
  const activeDashaRef = useRef(null);
  const [isExpert, setIsExpert] = useState(false);
  const [kundaliView, setKundaliView] = useState("d1");

  const [aiSummary, setAiSummary] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  
  const [lkSummary, setLkSummary] = useState("");
  const [loadingLk, setLoadingLk] = useState(false);

  const fetchLkSummary = async () => {
    setLoadingLk(true);
    try {
      const prompt = `Give a concise 3-sentence Lal Kitaab reading for ${pr.name}, Lagna: ${ch.d1.lagna}, Moon Sign: ${ch.moonSign}. Provide one clear, actionable Lal Kitaab remedy.`;
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

  const fetchAiSummary = async () => {
    setLoadingAi(true);
    try {
      const prompt = `Give a concise 3-sentence Jyotish astrological summary for ${pr.name}, Lagna: ${ch.d1.lagna}, Moon Sign: ${ch.moonSign}. Highlight their core strength and current focus based on transits.`;
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


  const currentYear = date.getFullYear() + (date.getMonth() / 12);

  useEffect(() => {
    setChartStyle((settings?.kundaliStyle || "north").toUpperCase());
  }, [settings?.kundaliStyle]);

  useEffect(() => {
    if (ch && ch.dasha && window.getAntardashas) {
      const activeIndex = ch.dasha.findIndex(d => currentYear >= d.start && currentYear < d.end);
      if (activeIndex !== -1) {
        setExpandedDasha(activeIndex);
        const d = ch.dasha[activeIndex];
        const antars = window.getAntardashas(d.lord, d.start, d.end);
        const aIdx = antars.findIndex(a => currentYear >= a.start && currentYear < a.end);
        setExpandedAntar(aIdx !== -1 ? activeIndex + "-" + aIdx : null);
      } else {
        setExpandedDasha(0);
        setExpandedAntar("0-0");
      }
    }
  }, [ch, date]);

  if (!ch) return <div className="p-10 text-center t50 text-sm font-mono">Awaiting Astral Data...</div>;

  const weekday = window.WEEKDAY[date.getDay()];
  const gochara = window.generateDeepGochara ? window.generateDeepGochara(ch, ch.d1?.lagna || "Aries", date, weekday, bioScores || { p: 0, e: 0, i: 0 }) : {};
  const formattedStyle = chartStyle.charAt(0).toUpperCase() + chartStyle.slice(1).toLowerCase();

  const customScrollStyle = { scrollbarWidth: "thin", scrollbarColor: "rgba(251, 191, 36, 0.2) transparent" };
  const sankalp = pr.gotra ? `Om Tat Sat. Native ${pr.name}, of ${pr.gotra} Gotra, seeking blessings of ${pr.kulDevta || 'Kul Devta'} at ${pr.place}.` : null;

  const deepSynthesis = window.generateDeepSynthesis ? window.generateDeepSynthesis(pr, ch, bioScores || {p:0,e:0,i:0}, date) : {};
  const dynamicRx = deepSynthesis.dynamicPrescription || {};
  const activeKundali = ((kundaliView === "chalit" || kundaliView === "kp") && ch.chalit) ? ch.chalit : (ch[kundaliView] || ch.d1);
  const chartNames = { d1: "Lagna (D1)", chalit: "Bhava Chalit", d9: "Navamsha (D9)", d3: "Drekkana (D3)", d7: "Saptamsha (D7)", d10: "Dashamsha (D10)", kp: "KP Cuspal Chart" };
  const kundaliTitle = chartNames[kundaliView] || "Kundali";


  const getTimelineData = () => {
    if (!ch || !ch.dasha || !window.getAntardashas) return null;
    const activeD = ch.dasha.find(d => currentYear >= d.start && currentYear < d.end);
    if (!activeD) return null;
    return {
      mahadasha: activeD,
      antardashas: window.getAntardashas(activeD.lord, activeD.start, activeD.end)
    };
  };
  const timelineData = getTimelineData();

  return (
    <div className="space-y-6 pb-12 gl-fadein mt-4">
      <style>{`
        .beauty-scroll::-webkit-scrollbar { width: 6px; }
        .beauty-scroll::-webkit-scrollbar-track { background: transparent; }
        .beauty-scroll::-webkit-scrollbar-thumb { background-color: rgba(251, 191, 36, 0.2); border-radius: 10px; }
      `}</style>

      {/* HEADER & SANKALP - Bento Grid Card */}
      <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl flex justify-between items-start transition hover:border-[#3f3f46]">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Astrological Dossier
          </div>
          <h2 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">{pr.name}</h2>
          <div className="text-xs text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-2">
            <span className="bg-[#09090b] px-2 py-0.5 rounded border border-[#27272a]">{pr.dob}</span>
            <span className="bg-[#09090b] px-2 py-0.5 rounded border border-[#27272a]">{pr.time}</span>
            <span className="bg-[#09090b] px-2 py-0.5 rounded border border-[#27272a]">{pr.place}</span>
          </div>
          {sankalp && (
            <div className="text-[11px] text-indigo-300 font-mono mt-3 bg-indigo-500/10 inline-block px-3.5 py-1.5 rounded-xl border border-indigo-500/20">
              {sankalp}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.dispatchEvent(new CustomEvent('generate-pdf'))} title="Export PDF" className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20 hover:bg-green-500/20 transition shadow-lg">
            <i className="ph ph-file-pdf text-lg"></i>
          </button>
          <button onClick={() => onEdit(pr)} title="Edit Profile" className="w-10 h-10 rounded-xl bg-[#09090b] text-slate-300 flex items-center justify-center border border-[#27272a] hover:bg-[#27272a] transition shadow-lg">
            <i className="ph ph-pencil-simple text-lg"></i>
          </button>
        </div>
      </div>

      {/* TIME HORIZON CONTROLLER */}
      <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-5 shadow-2xl flex flex-col xl:flex-row justify-between items-center gap-4 relative z-20 transition hover:border-[#3f3f46]">
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <div className="w-11 h-11 rounded-2xl border border-indigo-500/30 flex items-center justify-center text-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 shrink-0">
            <i className="ph ph-clock-counter-clockwise text-xl"></i>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">Active Prediction Horizon</div>
            <div className="text-lg text-white font-bold tracking-tight">{weekday}, {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-1.5 bg-[#09090b] p-1.5 rounded-2xl border border-[#27272a] w-full xl:w-auto">
          {[{ l: "-1M", d: -30 }, { l: "-1W", d: -7 }, { l: "-1D", d: -1 }, { l: "Today", d: 0 }, { l: "+1D", d: 1 }, { l: "+1W", d: 7 }, { l: "+1M", d: 30 }].map(btn => (
            <button key={btn.l} onClick={() => { const nd = new Date(date); nd.setDate(nd.getDate() + btn.d); btn.d === 0 ? setDate(new Date()) : setDate(nd); }} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition ${btn.d === 0 ? 'bg-white text-black font-bold shadow' : 'bg-transparent text-slate-400 hover:text-white hover:bg-[#27272a]'}`}>
              {btn.l}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC AI JYOTISH SYNTHESIS */}
      <div className="bg-[#18181b] p-6 rounded-3xl border border-[#27272a] shadow-2xl transition hover:border-[#3f3f46]">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <i className="ph ph-sparkle text-indigo-400"></i> AI Jyotish Engine Synthesis
        </h3>
        {!isExpert ? (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
            <div className="p-3 bg-[#09090b] rounded-2xl border border-[#27272a] whitespace-pre-wrap break-words"><strong className="text-indigo-300 font-bold block mb-1">The Core Self:</strong> {deepSynthesis.basicKundali}</div>
            <div className="p-3 bg-[#09090b] rounded-2xl border border-[#27272a] whitespace-pre-wrap break-words"><strong className="text-blue-300 font-bold block mb-1">Time & Cycles:</strong> {deepSynthesis.basicDasha}</div>
            <div className="p-3 bg-[#09090b] rounded-2xl border border-[#27272a] whitespace-pre-wrap break-words"><strong className="text-green-300 font-bold block mb-1">Energy & Power:</strong> {deepSynthesis.basicPower}</div>
            <div className="p-3 bg-[#09090b] rounded-2xl border border-[#27272a] whitespace-pre-wrap break-words"><strong className="text-amber-300 block mb-1 font-bold">Daily Synchronization:</strong><span>{deepSynthesis.basicBio || "Your daily physical, emotional, and intellectual cycles are calculated below from your birth date and selected prediction date."}</span></div>
          </div>
        ) : (
          <div className="p-4 bg-[#09090b] rounded-2xl border border-[#27272a] text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
            • <strong className="text-white">Natal Strength:</strong> Your {ch.d1.lagna} Lagna sets a foundation. Moon placed in {ch.moonSign} demands emotional clarity.<br/>
            • <strong className="text-white">Biorhythm Impact:</strong> Intellect operating at {Math.round(((bioScores?.i + 1)/2)*100)}%, favorable for processing.<br/>
            • <strong className="text-white">Active Cycle:</strong> Governed by {ch.dasha[0]?.lord} Mahadasha.
          </div>
        )}
      </div>

      
      {sankalp && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-4 text-center font-serif text-amber-200/90 text-sm italic shadow-lg">
          <i className="ph ph-hands-praying text-amber-400/50 mr-2"></i> {sankalp}
        </div>
      )}

      <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl space-y-3 transition hover:border-[#3f3f46]">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lagna & Chalit Architectural Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#09090b] p-4 rounded-2xl border border-[#27272a] text-xs text-slate-300 leading-relaxed font-mono">
            <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block mb-1">Lagna Core</span>
            {deepSynthesis.lagnaMeaning}
          </div>
          <div className="bg-[#09090b] p-4 rounded-2xl border border-[#27272a] text-xs text-slate-300 leading-relaxed font-mono">
            <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block mb-1">Chalit Dynamics</span>
            {deepSynthesis.chalitMeaning}
          </div>
        </div>
      </div>

      {/* CHART KUNDALI ENGINE */}
      <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl relative overflow-visible transition hover:border-[#3f3f46]">
        <div className="flex justify-between items-center mb-6 relative z-20 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{kundaliTitle}</div>
            <div className="flex gap-1.5 bg-[#09090b] rounded-xl border border-[#27272a] p-1">
              {[
    { id: "d1", label: "D1 Lagna" },
    { id: "chalit", label: "Chalit" },
    { id: "d9", label: "D9 Navamsha" },
    { id: "d3", label: "D3 Drekkana" },
    { id: "d7", label: "D7 Saptamsha" },
    { id: "d10", label: "D10 Dashamsha" }, { id: "kp", label: "KP System" }
  ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setKundaliView(view.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition ${kundaliView === view.id ? 'bg-white text-black font-bold shadow' : 'text-slate-400 hover:text-white'}`}>
                  {view.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsExpert(!isExpert)} className={`px-3.5 py-1.5 rounded-xl border border-[#27272a] transition text-[10px] font-mono font-bold uppercase tracking-widest ${isExpert ? 'bg-indigo-600 text-white' : 'bg-[#09090b] text-slate-400 hover:text-white'}`}>
              {isExpert ? "Expert Mode" : "Basic Mode"}
            </button>
            <div className="relative">
              <button onClick={() => setShowStyleMenu(!showStyleMenu)} className="flex items-center gap-2 bg-[#09090b] px-3.5 py-1.5 rounded-xl border border-[#27272a] hover:border-[#3f3f46] transition">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Style:</span>
                <span className="text-indigo-400 text-[10px] font-bold font-mono uppercase">{chartStyle}</span>
                <i className={`ph ph-caret-${showStyleMenu ? 'up' : 'down'} text-indigo-400 text-[10px]`}></i>
              </button>
              {showStyleMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-[#18181b] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden z-50 p-1">
                  {["NORTH", "SOUTH", "EAST"].map(s => (
                    <div key={s} onClick={() => { setChartStyle(s); setShowStyleMenu(false); }} className={`px-3 py-2 text-xs font-mono rounded-xl cursor-pointer hover:bg-[#27272a] ${chartStyle === s ? 'text-white bg-indigo-600 font-bold' : 'text-slate-400'}`}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center min-h-[300px] relative z-10 p-4 bg-[#09090b] rounded-2xl border border-[#27272a]">
          {window.KundaliRenderer && <window.KundaliRenderer ac={activeKundali} ch={ch} kpTable={ch.kpTable} style={formattedStyle} isExpert={isExpert} isKpView={kundaliView === "kp"} titleDesc={kundaliTitle} />}
        </div>
      </div>

      {/* DASHAS AND SHADBALA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl transition hover:border-[#3f3f46]">
          <div className="flex justify-between items-end mb-4 border-b border-[#27272a] pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vimshottari Dasha Drilldown</h3>
          </div>
          
          {timelineData && (
            <div className="mb-6 p-4 bg-[#09090b] rounded-2xl border border-[#27272a] overflow-hidden">
              <div className="text-[9px] uppercase font-mono tracking-widest text-slate-500 mb-3 flex items-center justify-between">
                <span>Active Mahadasha Timeline: <span className="text-indigo-400 font-bold">{timelineData.mahadasha.lord}</span></span>
                <span>{Math.floor(timelineData.mahadasha.start)} - {Math.floor(timelineData.mahadasha.end)}</span>
              </div>
              <div className="overflow-x-auto beauty-scroll pb-4 -mb-4">
                <div className="flex items-center min-w-max gap-1.5 px-1 py-2">
                  {timelineData.antardashas.map((antar, idx) => {
                    const isActive = currentYear >= antar.start && currentYear < antar.end;
                    const isPast = currentYear >= antar.end;
                    const duration = antar.end - antar.start;
                    const w = Math.max(60, Math.min(120, duration * 30)); 
                    return (
                      <div key={idx} style={{ width: `${w}px` }} className={`relative flex flex-col items-center justify-center h-12 rounded-xl border transition-all ${
                        isActive ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] z-10 scale-110' :
                        isPast ? 'bg-[#121214] border-[#27272a] text-slate-600' :
                        'bg-[#18181b] border-[#27272a] text-slate-400 opacity-90'
                      }`}>
                        <div className="text-[10px] font-bold font-mono uppercase">{antar.lord}</div>
                        <div className="text-[8px] font-mono mt-0.5 opacity-80">{Math.floor(antar.start)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar" style={customScrollStyle}>
            {ch.dasha?.map((d, i) => {
              const isActive = currentYear >= d.start && currentYear < d.end;
              return (
                <div ref={isActive ? activeDashaRef : null} key={i} className={`border rounded-2xl p-3.5 transition-all ${isActive ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-[#09090b] border-[#27272a]'}`}>
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedDasha(expandedDasha === i ? null : i)}>
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-indigo-400' : 'text-slate-200'}`}>
                      {isActive && <span className="mr-1.5 text-indigo-400">●</span>} {d.lord} Mahadasha
                    </span>
                    <span className={`text-xs font-mono ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                      {Math.floor(d.start)} - {Math.floor(d.end)} <i className={`ph ph-caret-${expandedDasha === i ? 'up' : 'down'} ml-2`}></i>
                    </span>
                  </div>
                  {expandedDasha === i && (
                    <div className="mt-3 pt-3 border-t border-[#27272a] pl-2 space-y-3 gl-fadein">
                      {window.getAntardashas && window.getAntardashas(d.lord, d.start, d.end).map((antar, aIdx) => {
                        const isAntarActive = currentYear >= antar.start && currentYear < antar.end;
                        return (
                        <div key={aIdx}>
                          <div className={`text-[10px] font-mono font-bold cursor-pointer hover:opacity-80 transition flex justify-between items-center p-1.5 rounded-lg mb-1 ${isAntarActive ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : 'text-slate-400'}`} onClick={() => setExpandedAntar(expandedAntar === (i + "-" + aIdx) ? null : (i + "-" + aIdx))}>
                            <span>▶ {d.lord} - {antar.lord} Antar</span>
                            <span className="text-[9px]">{Math.floor(antar.start)} - {Math.floor(antar.end)}</span>
                          </div>
                          {expandedAntar === (i + "-" + aIdx) && (
                          <div className="pl-4 space-y-1 border-l border-[#27272a] ml-1 gl-fadein">
                            {window.getPratyantarDashas && window.getPratyantarDashas(antar.lord, antar.start, antar.end).map((prat, pIdx) => {
                              const isPratActive = currentYear >= prat.start && currentYear < prat.end;
                              return (
                              <div key={pIdx} className={`text-[9px] font-mono flex justify-between pl-2 relative transition ${isPratActive ? 'text-indigo-300 font-bold bg-indigo-500/20 p-1 rounded' : 'text-slate-500'}`}>
                                <span className="absolute -left-1 top-1 w-1 h-[1px] bg-[#27272a]"></span>
                                <span>↳ {prat.lord} Prat</span>
                                <span>{Math.floor(prat.start)}</span>
                              </div>
                            );
                            })}
                          </div>
                        )}
                        </div>
                      );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl transition hover:border-[#3f3f46]">
          <div className="flex justify-between items-end mb-4 border-b border-[#27272a] pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shadbala & Planetary Power</h3>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar" style={customScrollStyle}>
            {Object.entries(ch.shadbala || {}).sort((a,b)=>b[1]-a[1]).map(([planet, score]) => {
              const pInfo = window.PLANET_INFO[planet]; 
              const percentage = Math.min(100, (score / 600) * 100);
              return (
                <div key={planet} className="relative bg-[#09090b] p-3 rounded-2xl border border-[#27272a]">
                  <div className="flex justify-between text-[11px] font-mono mb-1.5">
                    <span className="font-bold flex items-center gap-1.5" style={{ color: pInfo?.color || '#818cf8' }}>
                      <span className="text-xs">{pInfo?.symbol}</span> {planet}
                    </span>
                    <span className="text-slate-200 font-bold">{(score / 60).toFixed(1)} Rupas</span>
                  </div>
                  <div className="h-1.5 bg-[#18181b] rounded-full border border-[#27272a] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: pInfo?.color || '#6366f1' }}></div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed mt-4 border-t border-[#27272a] pt-3">{deepSynthesis.shadbalaMeaning}</p>
        </div>
      </div>

      {/* GOCHARA / TRANSITS */}
      <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl transition hover:border-[#3f3f46]">
        <div className="flex justify-between items-end mb-4 border-b border-[#27272a] pb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gochara (Transit) Impact</h3>
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{weekday}, {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
        {!isExpert && <p className="text-xs text-slate-400 font-mono mb-4">Transits (Gochara) measure where the planets are in the sky *today* and how they interact with your static birth chart.</p>}
        <div className="space-y-3">
          {Object.entries(gochara).map(([domain, data]) => (
            <div key={domain} className="bg-[#09090b] p-3.5 rounded-2xl border border-[#27272a]">
              <div className="flex justify-between text-[11px] font-mono mb-1.5">
                <span className="font-bold text-white capitalize">{domain.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-indigo-400 font-bold">{Math.round(data.sc)}/100</span>
              </div>
              <div className="h-1.5 bg-[#18181b] rounded-full overflow-hidden border border-[#27272a] mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${data.sc}%` }}></div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono leading-snug">{data.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC PRESCRIPTIONS */}
      <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-2xl mb-6 transition hover:border-[#3f3f46]">
        <div className="flex justify-between items-end mb-4 border-b border-[#27272a] pb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <i className="ph ph-sparkle text-indigo-400"></i> Highly Personalized Remediation
          </h3>
          <span className="text-[10px] text-green-400 uppercase tracking-widest font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">● Chart Driven</span>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-4">{dynamicRx.action}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-[#09090b] p-4 rounded-2xl border border-[#27272a] col-span-1 md:col-span-2 shadow-inner">
            <div className="text-slate-500 text-[10px] uppercase mb-1 tracking-widest font-bold">Presiding Deity (Lagnesh) & Active Dasha Mantra</div>
            <div className="font-bold text-white text-sm">Adhidevata: {dynamicRx.deity}</div>
            <div className="text-slate-300 mt-2 bg-[#18181b] p-3 rounded-xl border border-[#27272a]">
              <span className="text-slate-500 text-[9px] uppercase block mb-1">Recite:</span>
              {dynamicRx.mantra}
            </div>
          </div>
          <div className="bg-[#09090b] p-4 rounded-2xl border border-[#27272a] shadow-inner">
            <div className="text-slate-500 text-[10px] uppercase mb-1 tracking-widest font-bold">Life Force Gemstone</div>
            <div className="font-bold text-white mt-1">{dynamicRx.gem}</div>
          </div>
          <div className="bg-[#09090b] p-4 rounded-2xl border border-[#27272a] shadow-inner">
            <div className="text-slate-500 text-[10px] uppercase mb-1 tracking-widest font-bold">Karmic Charity (Dana)</div>
            <div className="font-bold text-white mt-1">{dynamicRx.charity}</div>
          </div>
        </div>
      </div>

      {/* FIX: NOW PASSING DOB, TARGET DATE, AND UTC TO TRIGGER THE TRUE SINE WAVES */}
      {window.BiocycleWidget && <window.BiocycleWidget dob={pr.dob} targetDate={date} utcOffset={pr.utcOffset} />}
    </div>
  );
};
