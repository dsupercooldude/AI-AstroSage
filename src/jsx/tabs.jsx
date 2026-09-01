// src/jsx/tabs.jsx
var React = window.React;
var { useState, Fragment } = window.React;

window.TabOrchestrator = ({ pr, ch, date, setDate, settings, onEditProfile, prs, chs, u, setU, updateSettings }) => {
  const { PersonTab, ReportsTab, PanchangTab, CompatTab, AskTab, WeekTab, MonthTab, PalmistryTab, TarotTab } = window;
  const [tb, setTb] = useState("person");

  
  const bgImages = {
    person: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
    reports: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    panchang: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=1920&auto=format&fit=crop",
    union: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1920&auto=format&fit=crop",
    palmistry: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=1920&auto=format&fit=crop",
    tarot: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1920&auto=format&fit=crop",
    week: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1920&auto=format&fit=crop",
    month: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop",
    ask: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1920&auto=format&fit=crop"
  };

  const themeMap = {
    person: "from-indigo-950/20 via-black to-slate-950",
    reports: "from-blue-950/20 via-black to-cyan-950/10",
    panchang: "from-amber-950/20 via-black to-orange-950/10",
    union: "from-pink-950/20 via-black to-rose-950/10",
    palmistry: "from-violet-950/20 via-black to-purple-950/10",
    tarot: "from-emerald-950/20 via-black to-teal-950/10",
    week: "from-indigo-950/20 via-black to-blue-950/10",
    month: "from-slate-900/30 via-black to-slate-950",
    ask: "from-fuchsia-950/20 via-black to-indigo-950/10"
  };
  const activeTheme = themeMap[tb] || "from-black via-black to-black";


  return (
    
    
    <Fragment>
      <div className="fixed inset-0 -z-30 bg-black"></div>
      {/* Background Images for Preloading to avoid flicker */}
      {Object.entries(bgImages).map(([key, url]) => (
        <div 
          key={key}
          className={`fixed inset-0 -z-20 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat mix-blend-screen ${tb === key ? 'opacity-30' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${url})` }}
        ></div>
      ))}
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 ${activeTheme} opacity-80`}></div>

      {/* Bento Navigation Bar */}

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide rounded-2xl border border-[#27272a] bg-[#18181b] p-1.5 font-mono text-[11px] shadow-2xl mb-5">
        {[
          { id: "person", l: "Astrology & Dasha", icon: "planet" },
          { id: "reports", l: "Advanced Reports", icon: "file-text" },
          { id: "panchang", l: "Panchang & Muhurta", icon: "calendar" },
          { id: "union", l: "Union Milan", icon: "heart" },
          { id: "palmistry", l: "Hand Palmistry", icon: "hand" },
          { id: "tarot", l: "Tarot Oracle", icon: "cards" },
          { id: "week", l: "7-Day AI", icon: "sparkle" },
          { id: "month", l: "30-Day Macro", icon: "chart-line" },
          { id: "ask", l: "Vedic AI Sage", icon: "chat-circle-dots" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTb(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 transition-all text-xs ${
              tb === t.id ? "bg-white text-black font-bold shadow-lg shadow-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <window.Icon name={t.icon} size={14} />
            <span>{t.l}</span>
          </button>
        ))}
      </div>
      
      {tb === "person" && <PersonTab pr={pr} ch={ch} date={date} setDate={setDate} settings={settings} onEdit={onEditProfile} bioScores={window.bio ? window.bio(pr?.dob, date, pr?.utcOffset) : {p:0,e:0,i:0}} />}
      {tb === "reports" && <ReportsTab pr={pr} ch={ch} date={date} />}
      {tb === "panchang" && <PanchangTab d={date} setDate={setDate} p={pr} utc={pr?.utcOffset || 5.5} settings={settings} />}
      {tb === "union" && <CompatTab prs={prs} chs={chs} settings={settings} date={date} />}
      {tb === "palmistry" && <PalmistryTab pr={pr} />}
      {tb === "tarot" && <TarotTab settings={u?.settings} />}
      {tb === "week" && <WeekTab pr={pr} ch={ch} />}
      {tb === "month" && <MonthTab pr={pr} ch={ch} />}
      {tb === "ask" && <AskTab em={u.email} emHash={u.emailHash} set={settings} pr={pr} ch={ch} date={date} />}
    </Fragment>
  );
};
