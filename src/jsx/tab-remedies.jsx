// src/jsx/tab-remedies.jsx
var React = window.React;
var { useState, useEffect } = window.React;

window.RemediesTab = ({ pr, ch, date }) => {
  const [checklist, setChecklist] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`gl_remedies_${pr?.id}_${date?.toDateString()}`);
      if (stored) {
        setChecklist(JSON.parse(stored));
      } else {
        setChecklist({});
      }
    } catch(e) {}
  }, [pr?.id, date]);

  const toggleCheck = (key) => {
    setChecklist(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(`gl_remedies_${pr?.id}_${date?.toDateString()}`, JSON.stringify(next));
      } catch(e) {}
      return next;
    });
  };

  if (!pr || !ch || !ch.d1) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-50 text-center">
        <window.Icon name="sparkle" size={48} className="mb-4 text-slate-500" />
        <p className="text-sm font-mono text-slate-400">Please generate a Natal Profile first.</p>
      </div>
    );
  }

  // 1. Determine active Mahadasha / Antardasha
  const currentDecYear = date.getFullYear() + (date.getMonth() / 12) + (date.getDate() / 365.25);
  const mahaObj = ch.dasha?.find((d) => currentDecYear >= d.start && currentDecYear < d.end);
  const activeMaha = mahaObj ? mahaObj.lord : "Jupiter";
  let activeAntar = activeMaha;
  if (mahaObj && window.getAntardashas) {
    const antarList = window.getAntardashas(activeMaha, mahaObj.start, mahaObj.end);
    activeAntar = antarList.find((a) => currentDecYear >= a.start && currentDecYear < a.end)?.lord || activeMaha;
  }

  // 2. Weakest Planet (Shadbala)
  const sortedPower = Object.entries(ch.shadbala || {}).sort((a, b) => b[1] - a[1]);
  const weakPlanet = sortedPower[sortedPower.length - 1]?.[0] || "Saturn";
  
  // 3. Ruling Planet for the Day
  const pK = window.WEEKDAY[date.getDay()];
  const dayRuler = { Sun: "Sun", Mon: "Moon", Tue: "Mars", Wed: "Mercury", Thu: "Jupiter", Fri: "Venus", Sat: "Saturn" }[pK] || "Sun";

  const getRemedyCard = (title, planet, context, keyPrefix) => {
    const info = window.PLANET_INFO[planet];
    if (!info) return null;
    return (
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span style={{color: info.color}}>{info.symbol}</span> {title}: {planet}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{context}</p>
          </div>
        </div>
        <div className="space-y-2 mt-3 pt-3 border-t border-[#27272a]/50">
          <CheckItem id={`${keyPrefix}_mantra`} label={`Mantra: ${info.beej}`} checked={checklist[`${keyPrefix}_mantra`]} onToggle={() => toggleCheck(`${keyPrefix}_mantra`)} />
          <CheckItem id={`${keyPrefix}_charity`} label={`Donation: ${info.charity}`} checked={checklist[`${keyPrefix}_charity`]} onToggle={() => toggleCheck(`${keyPrefix}_charity`)} />
          <CheckItem id={`${keyPrefix}_action`} label={`Action: ${info.action}`} checked={checklist[`${keyPrefix}_action`]} onToggle={() => toggleCheck(`${keyPrefix}_action`)} />
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5 mt-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor: info.color}}></div>
            <span className="text-xs text-slate-300">Auspicious Gem/Color: <strong className="text-white">{info.gem}</strong> <span className="text-[10px] font-mono text-slate-500 uppercase">({info.color})</span></span>
          </div>
        </div>
      </div>
    );
  };

  const CheckItem = ({ id, label, checked, onToggle }) => (
    <label className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition group">
      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600 group-hover:border-indigo-400'}`}>
        {checked && <window.Icon name="check" size={12} weight="bold" className="text-white" />}
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-20 gl-fadein">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <window.Icon name="sparkle" size={20} weight="fill" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Daily Remedies & Upayas</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">Checklist for {date.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getRemedyCard("Ruling Day Planet", dayRuler, "The cosmic governor of today's energy.", "day")}
        {getRemedyCard("Active Antardasha", activeAntar, `Your current sub-cycle under ${activeMaha} Mahadasha.`, "dasha")}
      </div>
      
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-1">Natal Weakness (Shadbala)</h3>
        {getRemedyCard("Lifelong Focus", weakPlanet, "The planet with the lowest Shadbala score in your birth chart, requiring consistent effort.", "natal")}
      </div>
    </div>
  );
};
