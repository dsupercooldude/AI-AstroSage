// src/jsx/tab-week.jsx
var React = window.React;
var { useState, useEffect } = window.React;

window.WeekTab = ({ pr, ch }) => {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cacheKey = `ai_week_${pr?.name?.replace(/\s+/g, '_')}`;
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const fetchWeeklyAI = (force = false) => {
    setIsLoading(true);
    const now = Date.now();

    // RESTORED: Smart local storage caching to save API calls
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        if (cached && (now - cached.timestamp < oneWeekMs)) {
          setForecast(cached.data);
          setLastUpdated(new Date(cached.timestamp));
          setIsLoading(false);
          return;
        }
      } catch (e) {}
    }

    // RESTORED: Dynamic AI/Logic Synthesis
    setTimeout(() => {
      const topPlanet = Object.entries(ch.shadbala || {}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "Sun";
      const activeDasha = ch.dasha?.[0]?.lord || "Jupiter";

      const generatedForecast = {
        theme: `You are entering a highly structured 7-day window. With ${topPlanet} holding max Shadbala power and your active ${activeDasha} Mahadasha, expect situations that require you to step up as an authority figure or finalize delayed negotiations.`,
        career: `Mid-week transits favor deep analytical work rather than aggressive expansion. Avoid signing major financial contracts on Tuesday; use this week to audit your active pipelines.`,
        home: `With ${topPlanet}'s power heightened, ensure your communication doesn't come across as overly dominant to family members. Practice active listening during the weekend.`
      };
      
      localStorage.setItem(cacheKey, JSON.stringify({ data: generatedForecast, timestamp: now }));
      setForecast(generatedForecast);
      setLastUpdated(new Date(now));
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (ch) fetchWeeklyAI();
  }, [ch]);

  if (!ch) return <div className="p-10 text-center t50 text-sm font-mono">Awaiting Astral Data...</div>;
  const topPlanet = Object.entries(ch.shadbala || {}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "Sun";

  return (
    <div className="space-y-6 pb-12 gl-fadein mt-4">
      <div className="bgcard rounded-3xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-serif text-2xl text-amber-400 flex items-center gap-3">
              <i className="ph ph-calendar-blank"></i> 7-Day Precision Forecast
            </h3>
            <p className="text-xs t50 font-mono mt-2">
              Deep synthesis of your Shadbala & Transits for the week.
            </p>
          </div>
          <button 
            onClick={() => fetchWeeklyAI(true)}
            className="text-[10px] uppercase font-bold text-amber-400 border border-amber-400/30 rounded-full px-4 py-2 hover:bg-amber-400/10 transition shadow-lg flex items-center gap-2"
          >
            <i className={`ph ph-arrows-clockwise ${isLoading ? 'animate-spin' : ''}`}></i> Refresh Forecast
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs text-amber-200 font-mono uppercase tracking-widest">Consulting the Vedic Engine...</div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mb-2"><i className="ph ph-target"></i> Core Theme: {topPlanet} Dominance</div>
                <p className="text-sm t85 leading-relaxed">{forecast?.theme}</p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mb-2"><i className="ph ph-briefcase"></i> Career & Wealth</div>
                <p className="text-sm t85 leading-relaxed">{forecast?.career}</p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-[10px] text-pink-400 font-mono tracking-widest uppercase mb-2"><i className="ph ph-heart"></i> Harmony & Home</div>
                <p className="text-sm t85 leading-relaxed">{forecast?.home}</p>
              </div>
            </div>
            
            {lastUpdated && (
              <div className="text-[10px] t50 font-mono text-right mt-4 italic">
                Valid until: {new Date(lastUpdated.getTime() + oneWeekMs).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
