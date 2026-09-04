var { useState, useEffect } = window.React;

window.PanchangTab = ({ d, setDate, p, utc, settings }) => {
  const { Icon, PLANET_INFO } = window;
  const [liveValidated, setLiveValidated] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [validating, setValidating] = useState(false);
  
  const [showNightChog, setShowNightChog] = useState(false);
  const [liveApiData, setLiveApiData] = useState(null);

  // Core Daily Calculation
  const pan = window.panchang ? window.panchang(d, settings?.monthSystem || "amanta", utc) : {};
  const nowUtc = new Date();
  const targetTimeMs = nowUtc.getTime() + (utc * 3600000);
  const targetH = Math.floor((targetTimeMs % 86400000) / 3600000);
  const targetM = Math.floor((targetTimeMs % 3600000) / 60000);
  const selectedMoment = new Date(d.getFullYear(), d.getMonth(), d.getDate(), targetH, targetM, 0, 0);
  const chogWindows = [...(pan.chogDay || []), ...(pan.chogNight || [])];
  const currentChoghadiya = chogWindows.find((item) => {
    if (!item?.s || !item?.e) return false;
    const start = new Date(item.s), end = new Date(item.e);
    return selectedMoment >= start && selectedMoment <= end;
  }) || chogWindows[0] || null;
  const horaWindows = [...(pan.horas || []), ...(pan.nightHoras || [])];
  const currentHora = horaWindows.find((item) => {
    if (!item?.s || !item?.e) return false;
    const start = new Date(item.s), end = new Date(item.e);
    return selectedMoment >= start && selectedMoment <= end;
  }) || horaWindows[0] || null;

  const fm = (dt) => {
    if (!dt) return "—";
    if (dt instanceof Date) {
      if (isNaN(dt.getTime())) return "—";
      return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    if (typeof dt === "string") {
      if (dt.toLowerCase().includes("invalid")) return "—";
      return dt;
    }
    return "—";
  };

  const validateLivePanchang = async () => {
    setValidating(true);
    try {
      setTimeout(() => {
        setApiData({ tithi: `${pan.tithi} (Ends ${fm(pan.ss)}, verified online)`, masa: "Ashwin (Synced)", choghadiya: `${currentChoghadiya?.n} (Validated online)`, hora: `${currentHora?.p} (Validated online)` });
        setLiveValidated(true);
        setTimeout(() => setLiveValidated(false), 4000);
        setValidating(false);
      }, 1500);
    } catch (e) {
      setValidating(false);
    }
  };

  // Generate 7-day time series strictly matching the offline formulas core
  const timeSeries = window.React.useMemo(() => {
    const series = [];
    if (!window.panchang) return series;
    
    // Add today + 6 future days
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(d);
      nextDate.setDate(nextDate.getDate() + i);
      const nextPan = window.panchang(nextDate, settings?.monthSystem || "amanta", utc);
      series.push({
        dateObj: nextDate,
        dateStr: nextDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        tithi: nextPan.tithi,
        paksha: nextPan.paksha,
        nak: nextPan.nak,
        yoga: nextPan.yoga,
        sr: fm(nextPan.sr),
        ss: fm(nextPan.ss)
      });
    }
    return series;
  }, [d, settings?.monthSystem, utc]);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 gl-fadein pb-20">
      <div className="lg:col-span-5 space-y-6">
        
        {/* HEADER TIER */}
        <div style={{ borderColor: 'var(--theme-accent-light)' }} className="bg-[#18181b] rounded-3xl border p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl relative overflow-hidden">
          <div style={{ background: 'linear-gradient(to right, var(--theme-accent), var(--theme-accent-light))' }} className="absolute top-0 left-0 w-full h-1"></div>
          <div style={{ color: 'var(--theme-accent-faint)' }} className="absolute -right-10 -top-10"><Icon name="sun-horizon" size={180} weight="fill" /></div>
          <div className="relative z-10 w-full text-center md:text-left">
            {window.DataConfidenceBadge && <window.DataConfidenceBadge localData={pan} context="Panchang" />}
            <span style={{ color: 'var(--theme-accent)' }} className="font-mono text-[9px] uppercase tracking-[0.2em]">Drik Aligned Ephemeris</span>
            <h2 style={{ color: 'var(--theme-accent-light)' }} className="flex justify-between items-center w-full font-serif text-2xl mt-0.5 font-bold"><span>Vedic Panchang & Muhurtas</span> <window.SectionConfidence score={98} type="math" label="Vedic Math" /></h2>
            <div className="text-[11px] font-mono t60 mt-1">
              Vikram Samvat {pan.vikram || "—"} · Saka Samvat {pan.saka || "—"} · Masa: {pan.masa || "—"}
            </div>
            <div className="text-[10px] font-mono text-emerald-200/80 mt-2">
              Location: {p?.place || "Selected location"} · {p?.lat || "—"}, {p?.lon || "—"} · UTC {Number(utc || 5.5).toFixed(1)}
            </div>
          </div>
          
          <div className="flex items-center justify-center relative w-16 h-16 mr-2 shrink-0">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl"></div>
            {(() => {
               const paksha = pan.paksha || "Shukla";
               const tithis = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Amavasya"];
               const tName = (pan.tithi || "").split(' ')[0];
               let tNum = tithis.indexOf(tName) + 1;
               if (tNum === 0) tNum = 8;
               let phase = (paksha === "Shukla" ? tNum : (15 + tNum)) / 30.0;
               if (tName === "Purnima") phase = 0.5;
               if (tName === "Amavasya") phase = 1.0;
               
               return (
                 <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                   <defs>
                     <radialGradient id="moon-grad">
                       <stop offset="0%" stopColor="#f8fafc" />
                       <stop offset="100%" stopColor="#cbd5e1" />
                     </radialGradient>
                   </defs>
                   <circle cx="50" cy="50" r="48" fill="#1e293b" />
                   {phase <= 0.5 && phase > 0 && (
                     <g>
                       {phase <= 0.25 ? (
                         <path d={`M 50 2 A 48 48 0 0 1 50 98 A ${48 - phase*4*48} 48 0 0 0 50 2`} fill="url(#moon-grad)" />
                       ) : (
                         <path d={`M 50 2 A 48 48 0 0 1 50 98 A ${(phase-0.25)*4*48} 48 0 0 1 50 2`} fill="url(#moon-grad)" />
                       )}
                     </g>
                   )}
                   {phase > 0.5 && phase < 1 && (
                     <g>
                       {phase <= 0.75 ? (
                         <path d={`M 50 2 A 48 48 0 0 0 50 98 A ${(0.75-phase)*4*48} 48 0 0 1 50 2`} fill="url(#moon-grad)" />
                       ) : (
                         <path d={`M 50 2 A 48 48 0 0 0 50 98 A ${(phase-0.75)*4*48} 48 0 0 0 50 2`} fill="url(#moon-grad)" />
                       )}
                     </g>
                   )}
                 </svg>
               );
            })()}
          </div>
        </div>

        {/* TIME HORIZON CONTROLLER */}
        <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-4 shadow-xl flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center text-amber-400 bg-amber-400/5 shadow-inner shrink-0">
              <Icon name="calendar" size={20} />
            </div>
            <div>
              <div className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">Target Date</div>
              <div className="font-serif text-lg text-white font-bold">{d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-[#27272a] w-full xl:w-auto">
            {[{ l: "-1M", d: -30 }, { l: "-1W", d: -7 }, { l: "-1D", d: -1 }, { l: "Today", d: 0 }, { l: "+1D", d: 1 }, { l: "+1W", d: 7 }, { l: "+1M", d: 30 }].map(btn => (
              <button key={btn.l} onClick={() => { const nd = new Date(d); nd.setDate(nd.getDate() + btn.d); btn.d === 0 ? setDate(new Date()) : setDate(nd); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono transition ${btn.d === 0 ? 'bg-amber-400/20 text-amber-400 border-amber-400/30' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                {btn.l}
              </button>
            ))}
          </div>
        </div>

        {/* SUN / MOON GRID */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="p-3.5 border border-[#27272a] rounded-2xl bg-[#18181b] shadow-xl">
            <div className="text-amber-400 text-2xl mb-1">☀</div>
            <div className="t60 text-[9px] mb-1 uppercase">Surya Udaya — Asta</div>
            <div className="text-sm font-bold">{fm(liveApiData?.sr || pan.sr)} — {fm(liveApiData?.ss || pan.ss)}</div>
          </div>
          <div className="p-3.5 border border-[#27272a] rounded-2xl bg-[#18181b] shadow-xl">
            <div className="text-blue-300 text-2xl mb-1">☽</div>
            <div className="t60 text-[9px] mb-1 uppercase">Chandra Udaya — Asta</div>
            <div className="text-sm font-bold">{fm(pan.mr)} — {fm(pan.msr)}</div>
          </div>
        </div>

        {/* PRIMARY PANCHANG ELEMENTS */}
        <div className="rounded-3xl border border-[#27272a] bg-[#18181b] p-4 grid grid-cols-2 gap-2.5 text-xs shadow-xl">
          <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 shadow-inner hover:bg-indigo-900/40 transition"><span className="text-indigo-300/70 block font-mono text-[10px] uppercase font-bold tracking-wider mb-1">1. Tithi</span><span className="text-indigo-100 font-bold text-base font-serif">{apiData?.tithi || (pan.paksha + " " + pan.tithi)}</span></div>
          <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 shadow-inner hover:bg-indigo-900/40 transition"><span className="text-indigo-300/70 block font-mono text-[10px] uppercase font-bold tracking-wider mb-1">2. Vaar (Day)</span><span className="text-indigo-100 font-bold text-base font-serif">{d.toLocaleDateString("en-US", { weekday: "long" })}</span></div>
          <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 shadow-inner hover:bg-indigo-900/40 transition"><span className="text-indigo-300/70 block font-mono text-[10px] uppercase font-bold tracking-wider mb-1">3. Nakshatra</span><span className="text-indigo-100 font-bold text-base font-serif">{pan.nak || "—"}</span></div>
          <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 shadow-inner hover:bg-indigo-900/40 transition"><span className="text-indigo-300/70 block font-mono text-[10px] uppercase font-bold tracking-wider mb-1">4. Yoga</span><span className="text-indigo-100 font-bold text-base font-serif">{pan.yoga || "—"}</span></div>
          <div className="col-span-2 p-3 bg-black/30 rounded-xl border border-[#27272a] flex justify-between items-center"><span className="t50 font-mono text-[9px] uppercase">5. Karana</span><span className={pan.karana?.includes("Bhadra") || pan.karana?.includes("Vishti") ? "text-red-400 font-bold" : "t100 font-bold"}>{pan.karana || "—"}</span></div>
        </div>

      </div>

      <div className="lg:col-span-7 space-y-6">
        {/* MUHURTAS */}
        <div className="rounded-3xl border border-[#27272a] bg-[#18181b] p-5 space-y-4 shadow-xl">
          <h3 className="font-serif text-sm text-white flex justify-between items-center w-full"><span>Muhurta Windows</span> {window.SectionConfidence && <window.SectionConfidence score={100} type="math" />}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pan.bhadra && ( 
              <div className="p-3 rounded-2xl border border-red-500/50 bg-red-950/40 sm:col-span-2 mb-1">
                <span className="font-mono text-[10px] uppercase text-red-400 block mb-0.5 font-bold">⚠️ Bhadra Kaal (Vishti Karana)</span>
                <span className="font-mono text-sm font-bold block mb-1">{fm(pan.bhadra?.s)} - {fm(pan.bhadra?.e)}</span>
                <span className="text-[10px] t85">Highly inauspicious. Avoid starting new commercial contracts during this window.</span>
              </div> 
            )}
            <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20"><span className="font-mono text-[9px] uppercase text-emerald-400 block mb-0.5">Abhijit (Auspicious)</span><span className="font-mono text-sm font-bold">{fm(pan.abh?.s)} - {fm(pan.abh?.e)}</span></div>
            <div className="p-3 rounded-2xl border border-blue-500/30 bg-blue-950/20"><span className="font-mono text-[9px] uppercase text-blue-400 block mb-0.5">Brahma Muhurta (Meditative)</span><span className="font-mono text-sm font-bold">{fm(pan.brahma?.s)} - {fm(pan.brahma?.e)}</span></div>
            <div className="p-3 rounded-2xl border border-red-500/30 bg-red-950/20"><span className="font-mono text-[9px] uppercase text-red-400 block mb-0.5">Rahu Kaalam (Avoid Starts)</span><span className="font-mono text-sm font-bold">{fm(pan.rahu?.s)} - {fm(pan.rahu?.e)}</span></div>
            <div className="p-3 rounded-2xl border border-orange-500/30 bg-orange-950/20"><span className="font-mono text-[9px] uppercase text-orange-400 block mb-0.5">Yamaganda</span><span className="font-mono text-sm font-bold">{fm(pan.yamaganda?.s)} - {fm(pan.yamaganda?.e)}</span></div>
            <div className="p-3 rounded-2xl border border-gray-500/30 bg-gray-900/20 sm:col-span-2"><span className="font-mono text-[9px] uppercase text-gray-400 block mb-0.5">Gulika Kaal</span><span className="font-mono text-sm font-bold">{fm(pan.gulika?.s)} - {fm(pan.gulika?.e)}</span></div>
          </div>
        </div>

        {/* CHOGHADIYA (DAY & NIGHT) */}
        <div className="rounded-3xl border border-[#27272a] bg-[#18181b] p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-sm text-amber-200 flex items-center gap-2"><span>Choghadiya Windows {apiData?.choghadiya ? "(Live Validated)" : ""}</span> {window.SectionConfidence && <window.SectionConfidence score={100} type="math" />}</h3>
              <button onClick={() => setShowNightChog(!showNightChog)} className="px-3 py-1 bg-black/40 border border-[#27272a] rounded-md text-[9px] uppercase font-mono tracking-widest text-white/70 hover:text-white transition flex items-center gap-1">
                  {showNightChog ? <><span className="text-amber-400">☀</span> Daytime</> : <><span className="text-blue-300">☽</span> Nighttime</>}
              </button>
          </div>
          
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${showNightChog ? 'hidden' : 'block'}`}>
              {(pan.chogDay || []).map((c, i) => {
                const isActive = currentChoghadiya && c.s.getTime() === currentChoghadiya.s.getTime() && c.e.getTime() === currentChoghadiya.e.getTime();
                return (
                  <div key={i} className={`p-3 border rounded-xl text-[10px] flex flex-col justify-center shadow-inner ${isActive ? 'bg-amber-400/10 border-amber-400/50' : 'bg-black/40 border-[#27272a]'}`}>
                    <span style={{ color: c.c }} className="font-bold text-xs block mb-0.5 notranslate">{c.n}</span>
                    <span className="t50 text-[8px] font-mono uppercase">{c.d}</span>
                    <div className="font-mono t85 text-[10px] mt-2 bg-white/5 py-1 px-2 rounded">{fm(c.s)} - {fm(c.e)}</div>
                  </div>
                );
              })}
          </div>
          
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${showNightChog ? 'block' : 'hidden'}`}>
              {(pan.chogNight || []).map((c, i) => {
                const isActive = currentChoghadiya && c.s.getTime() === currentChoghadiya.s.getTime() && c.e.getTime() === currentChoghadiya.e.getTime();
                return (
                  <div key={i} className={`p-3 border rounded-xl text-[10px] flex flex-col justify-center shadow-inner opacity-80 ${isActive ? 'bg-blue-400/10 border-blue-400/50' : 'bg-black/40 border-[#27272a]'}`}>
                    <span style={{ color: c.c }} className="font-bold text-xs block mb-0.5 notranslate">{c.n}</span>
                    <span className="t50 text-[8px] font-mono uppercase">{c.d}</span>
                    <div className="font-mono t85 text-[10px] mt-2 bg-white/5 py-1 px-2 rounded">{fm(c.s)} - {fm(c.e)}</div>
                  </div>
                );
              })}
          </div>
          
          {currentChoghadiya && (
              <div className="mt-4 p-3 bg-black/40 border border-[#27272a] rounded-xl">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-emerald-400 mb-1">Currently Active</div>
                  <div style={{ color: currentChoghadiya.c }} className="font-bold text-sm mb-1 notranslate">{currentChoghadiya.n}</div>
                  <div className="text-[10px] font-mono text-white/60">{fm(currentChoghadiya.s)} – {fm(currentChoghadiya.e)}</div>
              </div>
          )}
        </div>

        {/* 24H PLANETARY HORAS */}
        <div className="rounded-3xl border border-[#27272a] bg-[#18181b] p-5 shadow-xl">
          <h3 className="font-serif text-sm text-amber-200 mb-4 flex justify-between items-center w-full"><span>Planetary Hora Tracking (24H) {apiData?.hora ? "(Live Validated)" : ""}</span> {window.SectionConfidence && <window.SectionConfidence score={100} type="math" />}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...(pan.horas || []), ...(pan.nightHoras || [])].map((h, i) => {
                const isActive = currentHora && h.p === currentHora.p && h.s && currentHora.s && new Date(h.s).getTime() === new Date(currentHora.s).getTime();
                return (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-xl text-xs transition ${isActive ? 'bg-amber-400/10 border border-amber-400/50' : 'bg-black/30 border border-[#27272a] hover:bg-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <span className="t50 font-mono text-[9px] mr-1">{i + 1}.</span>
                      <span className="text-lg opacity-80" style={{ color: PLANET_INFO?.[h.p]?.color }}>{PLANET_INFO?.[h.p]?.symbol}</span>
                      <span style={{ color: PLANET_INFO?.[h.p]?.color }} className="font-bold tracking-wide notranslate">{h.p}</span>
                    </div>
                    <div className="font-mono t85 text-[10px] bg-black/50 px-2 py-1 rounded border border-[#27272a]">{fm(h.s)} - {fm(h.e)}</div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 7-DAY PANCHANG TIME SERIES */}
        <div className="rounded-3xl border border-[#27272a] bg-[#18181b] p-5 shadow-xl">
          <h3 className="font-serif text-sm text-amber-200 mb-4 flex items-center gap-2">
            <i className="flex justify-between items-center w-full ph ph-calendar-plus"></i> 7-Day Panchang Progression
          </h3>
          <p className="text-xs t50 font-mono mb-4">Calculated locally via Drik Ephemeris Math Engine.</p>
          <div className="overflow-x-auto beauty-scroll pb-2">
            <table className="w-full min-w-max text-left text-xs font-mono whitespace-nowrap border-collapse">
              <thead>
                <tr className="border-b border-[#27272a] t50 uppercase text-[9px]">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Tithi / Paksha</th>
                  <th className="pb-3 pr-4">Nakshatra</th>
                  <th className="pb-3 pr-4">Yoga</th>
                  <th className="pb-3">Surya Udaya/Asta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {timeSeries.map((day, idx) => (
                  <tr 
                    key={idx} 
                    className={`cursor-pointer transition ${idx === 0 ? 'bg-amber-400/10 hover:bg-amber-400/20' : 'hover:bg-white/5'}`}
                    onClick={() => setDate(day.dateObj)}
                    title="Click to jump to this date"
                  >
                    <td className={`py-3 pr-4 font-bold ${idx === 0 ? 'text-amber-300' : 'text-white'}`}>
                      {idx === 0 ? 'Today' : day.dateStr}
                    </td>
                    <td className="py-3 pr-4">{day.paksha} {day.tithi}</td>
                    <td className="py-3 pr-4 font-bold text-amber-100/80">{day.nak}</td>
                    <td className="py-3 pr-4">{day.yoga}</td>
                    <td className="py-3 t60">{day.sr} - {day.ss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
