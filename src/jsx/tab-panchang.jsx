var { useState, useEffect } = window.React;

window.PanchangTab = ({ d, setDate, p, utc, settings }) => {
  const { Icon, PLANET_INFO } = window;
  const [liveValidated, setLiveValidated] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showNightChog, setShowNightChog] = useState(false);
  const [liveApiData, setLiveApiData] = useState(null);

  // Core Daily Calculation
  const pan = panchang ? panchang(d, settings?.monthSystem || "amanta", utc) : {};
  const selectedMoment = new Date(d.getFullYear(), d.getMonth(), d.getDate(), new Date().getHours(), new Date().getMinutes(), 0, 0);
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
      const lat = Number(p?.lat ?? 25.2);
      const lon = Number(p?.lon ?? 55.2);
      const dateStr = d.toISOString().slice(0, 10);
      const res = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=${dateStr}`);
      const data = await res.json();
      if (data && data.results) {
        setLiveApiData({
          sr: data.results.sunrise,
          ss: data.results.sunset,
          lat,
          lon,
          date: dateStr
        });
        setLiveValidated(true);
        setTimeout(() => setLiveValidated(false), 4000);
      }
    } catch (e) {}
    setValidating(false);
  };

  // Generate 7-day time series strictly matching the offline formulas core
  const timeSeries = window.React.useMemo(() => {
    const series = [];
    if (!window.panchang) return series;
    
    // Add today + 6 future days
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(d);
      nextDate.setDate(nextDate.getDate() + i);
      const nextPan = panchang(nextDate, settings?.monthSystem || "amanta", utc);
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
  }, [d, settings?.monthSystem, utc, panchang]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 gl-fadein pb-20">
      
      {/* HEADER TIER */}
      <div className="bgcard rounded-3xl border border-emerald-500/30 p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-500"></div>
        <div className="absolute -right-10 -top-10 text-emerald-500/10"><Icon name="sun-horizon" size={180} weight="fill" /></div>
        <div className="relative z-10 w-full text-center md:text-left">
          <window.DataConfidenceBadge localData={pan} context="Panchang" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400">Drik Aligned Ephemeris</span>
          <h2 className="font-serif text-2xl text-emerald-100 mt-0.5">Vedic Panchang & Muhurtas</h2>
          <div className="text-[11px] font-mono t60 mt-1">
            Vikram Samvat {pan.vikram || "—"} · Saka Samvat {pan.saka || "—"} · Masa: {pan.masa || "—"}
          </div>
          <div className="text-[10px] font-mono text-emerald-200/80 mt-2">
            Location: {p?.place || "Selected location"} · {p?.lat || "—"}, {p?.lon || "—"} · UTC {Number(utc || 5.5).toFixed(1)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <button onClick={validateLivePanchang} disabled={validating} className="px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono text-[10px] hover:bg-emerald-500/20 transition flex items-center gap-1.5 w-full md:w-auto justify-center">
            <Icon name="broadcast" className={validating ? "animate-pulse" : ""} /> {validating ? "Verifying..." : liveValidated ? "API Synced!" : "Validate Live API"}
          </button>
        </div>
      </div>

      {/* TIME HORIZON CONTROLLER */}
      <div className="bgcard rounded-3xl border border-white/10 p-4 shadow-xl flex flex-col xl:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center text-amber-400 bg-amber-400/5 shadow-inner shrink-0">
            <Icon name="calendar" size={20} />
          </div>
          <div>
            <div className="text-[9px] text-amber-400 font-mono tracking-widest uppercase">Target Date</div>
            <div className="font-serif text-lg text-white font-bold">{d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 w-full xl:w-auto">
          {[{ l: "-1M", d: -30 }, { l: "-1W", d: -7 }, { l: "-1D", d: -1 }, { l: "Today", d: 0 }, { l: "+1D", d: 1 }, { l: "+1W", d: 7 }, { l: "+1M", d: 30 }].map(btn => (
            <button key={btn.l} onClick={() => { const nd = new Date(d); nd.setDate(nd.getDate() + btn.d); btn.d === 0 ? setDate(new Date()) : setDate(nd); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono transition ${btn.d === 0 ? 'bg-amber-400/20 text-amber-400 border-amber-400/30' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
              {btn.l}
            </button>
          ))}
        </div>
      </div>

      {/* SUN / MOON GRID */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
        <div className="p-3.5 border border-white/10 rounded-2xl bgcard shadow-xl">
          <div className="text-amber-400 text-2xl mb-1">☀</div>
          <div className="t60 text-[9px] mb-1 uppercase">Surya Udaya — Asta</div>
          <div className="text-sm font-bold">{fm(liveApiData?.sr || pan.sr)} — {fm(liveApiData?.ss || pan.ss)}</div>
        </div>
        <div className="p-3.5 border border-white/10 rounded-2xl bgcard shadow-xl">
          <div className="text-blue-300 text-2xl mb-1">☽</div>
          <div className="t60 text-[9px] mb-1 uppercase">Chandra Udaya — Asta</div>
          <div className="text-sm font-bold">{fm(pan.mr)} — {fm(pan.msr)}</div>
        </div>
      </div>

      {/* PRIMARY PANCHANG ELEMENTS */}
      <div className="rounded-3xl border border-white/10 bgcard p-4 grid grid-cols-2 gap-2.5 text-xs shadow-xl">
        <div className="p-3 bg-black/30 rounded-xl border border-white/5"><span className="t50 block font-mono text-[9px] uppercase mb-0.5">1. Tithi</span><span className="t100 font-bold">{pan.paksha || ""} {pan.tithi || "—"}</span></div>
        <div className="p-3 bg-black/30 rounded-xl border border-white/5"><span className="t50 block font-mono text-[9px] uppercase mb-0.5">2. Vaar (Day)</span><span className="t100 font-bold">{d.toLocaleDateString("en-US", { weekday: "long" })}</span></div>
        <div className="p-3 bg-black/30 rounded-xl border border-white/5"><span className="t50 block font-mono text-[9px] uppercase mb-0.5">3. Nakshatra</span><span className="t100 font-bold">{pan.nak || "—"}</span></div>
        <div className="p-3 bg-black/30 rounded-xl border border-white/5"><span className="t50 block font-mono text-[9px] uppercase mb-0.5">4. Yoga</span><span className="t100 font-bold">{pan.yoga || "—"}</span></div>
        <div className="col-span-2 p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center"><span className="t50 font-mono text-[9px] uppercase">5. Karana</span><span className={pan.karana?.includes("Bhadra") || pan.karana?.includes("Vishti") ? "text-red-400 font-bold" : "t100 font-bold"}>{pan.karana || "—"}</span></div>
      </div>

      {/* MUHURTAS */}
      <div className="rounded-3xl border border-white/10 bgcard p-5 space-y-4 shadow-xl">
        <h3 className="font-serif text-sm text-white">Muhurta Windows</h3>
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
      <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-sm text-amber-200">Choghadiya Windows (Day & Night)</h3>
            <button onClick={() => setShowNightChog(!showNightChog)} className="px-3 py-1 bg-black/40 border border-white/10 rounded-md text-[9px] uppercase font-mono tracking-widest text-white/70 hover:text-white transition flex items-center gap-1">
                {showNightChog ? <><span className="text-amber-400">☀</span> Daytime</> : <><span className="text-blue-300">☽</span> Nighttime</>}
            </button>
        </div>
        
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${showNightChog ? 'hidden' : 'block'}`}>
            {(pan.chogDay || []).map((c, i) => {
              const isActive = currentChoghadiya && c.s === currentChoghadiya.s && c.e === currentChoghadiya.e;
              return (
                <div key={i} className={`p-3 border rounded-xl text-[10px] flex flex-col justify-center shadow-inner ${isActive ? 'bg-amber-400/10 border-amber-400/50' : 'bg-black/40 border-white/5'}`}>
                  <span style={{ color: c.c }} className="font-bold text-xs block mb-0.5">{c.n}</span>
                  <span className="t50 text-[8px] font-mono uppercase">{c.d}</span>
                  <div className="font-mono t85 text-[10px] mt-2 bg-white/5 py-1 px-2 rounded">{fm(c.s)} - {fm(c.e)}</div>
                </div>
              );
            })}
        </div>
        
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${showNightChog ? 'block' : 'hidden'}`}>
            {(pan.chogNight || []).map((c, i) => {
              const isActive = currentChoghadiya && c.s === currentChoghadiya.s && c.e === currentChoghadiya.e;
              return (
                <div key={i} className={`p-3 border rounded-xl text-[10px] flex flex-col justify-center shadow-inner opacity-80 ${isActive ? 'bg-blue-400/10 border-blue-400/50' : 'bg-black/40 border-white/5'}`}>
                  <span style={{ color: c.c }} className="font-bold text-xs block mb-0.5">{c.n}</span>
                  <span className="t50 text-[8px] font-mono uppercase">{c.d}</span>
                  <div className="font-mono t85 text-[10px] mt-2 bg-white/5 py-1 px-2 rounded">{fm(c.s)} - {fm(c.e)}</div>
                </div>
              );
            })}
        </div>
        
        {currentChoghadiya && (
            <div className="mt-4 p-3 bg-black/40 border border-white/10 rounded-xl">
                <div className="text-[9px] uppercase font-mono tracking-widest text-emerald-400 mb-1">Currently Active</div>
                <div style={{ color: currentChoghadiya.c }} className="font-bold text-sm mb-1">{currentChoghadiya.n}</div>
                <div className="text-[10px] font-mono text-white/60">{fm(currentChoghadiya.s)} – {fm(currentChoghadiya.e)}</div>
            </div>
        )}
      </div>

      {/* 24H PLANETARY HORAS */}
      <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl">
        <h3 className="font-serif text-sm text-amber-200 mb-4">Planetary Hora Tracking (24H)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[...(pan.horas || []), ...(pan.nightHoras || [])].map((h, i) => {
              const isActive = currentHora && h.p === currentHora.p && h.s && currentHora.s && new Date(h.s).getTime() === new Date(currentHora.s).getTime();
              return (
                <div key={i} className={`flex justify-between items-center p-3 rounded-xl text-xs transition ${isActive ? 'bg-amber-400/10 border border-amber-400/50' : 'bg-black/30 border border-white/5 hover:bg-white/5'}`}>
                  <div className="flex items-center gap-2">
                    <span className="t50 font-mono text-[9px] mr-1">{i + 1}.</span>
                    <span className="text-lg opacity-80" style={{ color: PLANET_INFO[h.p]?.color }}>{PLANET_INFO[h.p]?.symbol}</span>
                    <span style={{ color: PLANET_INFO[h.p]?.color }} className="font-bold tracking-wide">{h.p}</span>
                  </div>
                  <div className="font-mono t85 text-[10px] bg-black/50 px-2 py-1 rounded border border-white/5">{fm(h.s)} - {fm(h.e)}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* NEW: 7-DAY PANCHANG TIME SERIES */}
      <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl">
        <h3 className="font-serif text-sm text-amber-200 mb-4 flex items-center gap-2">
          <i className="ph ph-calendar-plus"></i> 7-Day Panchang Progression
        </h3>
        <p className="text-xs t50 font-mono mb-4">Calculated locally via Drik Ephemeris Math Engine.</p>
        <div className="overflow-x-auto beauty-scroll pb-2">
          <table className="w-full text-left text-xs font-mono whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-white/10 t50 uppercase text-[9px]">
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
  );
};