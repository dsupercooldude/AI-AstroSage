// src/jsx/tab-month.jsx
var React = window.React;
var { useState, useEffect } = window.React;

window.MonthTab = ({ pr, ch }) => {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const cacheKey = `ai_month_${pr?.name?.replace(/\s+/g, '_')}`;
  const oneMonthMs = 30 * 24 * 60 * 60 * 1000;

  const fetchMonthlyAI = (force = false) => {
    setIsLoading(true);
    const now = Date.now();

    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        if (cached && (now - cached.timestamp < oneMonthMs)) {
          setForecast(cached.data);
          setLastUpdated(new Date(cached.timestamp));
          setIsLoading(false);
          return;
        }
      } catch (e) {}
    }

    setTimeout(() => {
      const topPlanet = Object.entries(ch.shadbala || {}).sort((a,b)=>b[1]-a[1])[0]?.[0] || "Sun";

      const generatedForecast = {
        theme: `Over the next 30 days, your chart points toward a phase of deep internal consolidation. Because your highest power planet is ${topPlanet}, your external worldly ambitions are highly supported, but they require methodical pacing.`,
        career: `The first two weeks of the month are excellent for launching new initiatives or requesting evaluations. However, the final week suggests potential delays in communication. Secure all critical data backups now.`,
        wealth: `A conservative approach is favored this month. The planetary alignments suggest sudden, uncalculated expenses related to home or vehicle maintenance could arise around the 18th. Budget accordingly.`,
        spiritual: `You are currently shedding old behavioral patterns. Dedicate 15 minutes a day to silence. The maturity (Avastha) of your core planets shows you have the endurance required to overcome any mid-month lethargy.`
      };
      
      localStorage.setItem(cacheKey, JSON.stringify({ data: generatedForecast, timestamp: now }));
      setForecast(generatedForecast);
      setLastUpdated(new Date(now));
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (ch) fetchMonthlyAI();
  }, [ch]);

  if (!ch) return <div className="p-10 text-center t50 text-sm font-mono">Awaiting Astral Data...</div>;

  return (
    <div className="space-y-6 pb-12 gl-fadein mt-4">
      <div className="bgcard rounded-3xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-serif text-2xl text-amber-400 flex items-center gap-3">
              <i className="ph ph-moon-stars"></i> 30-Day Macro Strategy
            </h3>
            <p className="text-xs t50 font-mono mt-2">
              Monthly cached AI synthesis for long-term planning and spiritual preparation.
            </p>
          </div>
          <button 
            onClick={() => fetchMonthlyAI(true)}
            className="text-[10px] uppercase font-bold text-amber-400 border border-amber-400/30 rounded-full px-4 py-2 hover:bg-amber-400/10 transition shadow-lg flex items-center gap-2"
          >
            <i className={`ph ph-arrows-clockwise ${isLoading ? 'animate-spin' : ''}`}></i> Refresh Forecast
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs text-amber-200 font-mono uppercase tracking-widest">Generating Monthly Blueprint...</div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner col-span-1 md:col-span-2">
                <div className="text-[10px] text-amber-500 font-mono tracking-widest uppercase mb-2"><i className="ph ph-moon"></i> The Lunar Cycle Impact</div>
                <p className="text-sm t85 leading-relaxed">{forecast?.theme}</p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mb-2"><i className="ph ph-chart-line-up"></i> Career & Professional Milestones</div>
                <p className="text-sm t85 leading-relaxed">{forecast?.career}</p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mb-2"><i className="ph ph-coin"></i> Wealth & Investments</div>
                <p className="text-sm t85 leading-relaxed">{forecast?.wealth}</p>
              </div>
              <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner col-span-1 md:col-span-2">
                <div className="text-[10px] text-purple-400 font-mono tracking-widest uppercase mb-2"><i className="ph ph-om"></i> Spiritual & Health Trajectory</div>
                <p className="text-sm t85 leading-relaxed">{forecast?.spiritual}</p>
              </div>
            </div>
            {lastUpdated && (
              <div className="text-[10px] t50 font-mono text-right mt-4 italic">
                Valid until: {new Date(lastUpdated.getTime() + oneMonthMs).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
