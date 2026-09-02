// src/jsx/tabs.jsx
var React = window.React;
var { useState, Fragment } = window.React;

window.TabOrchestrator = ({ pr, ch, date, setDate, settings, onEditProfile, prs, chs, u, setU, updateSettings }) => {
  const { PersonTab, ReportsTab, PanchangTab, CompatTab, AskTab, WeekTab, MonthTab, PalmistryTab, TarotTab } = window;
  const [tb, setTb] = useState("person");

  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('tabChanged', { detail: tb }));
  }, [tb]);

  
  const bgImages = {
    person: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",
    reports: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1920&auto=format&fit=crop",
    panchang: "https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=1920&auto=format&fit=crop", // Sunset sky
    union: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1920&auto=format&fit=crop",
    palmistry: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=1920&auto=format&fit=crop",
    tarot: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop", // Nebula / deep purple
    week: "https://images.unsplash.com/photo-1504333638930-c8787321efa0?q=80&w=1920&auto=format&fit=crop",
    month: "https://images.unsplash.com/photo-1475274047050-51d393442819?q=80&w=1920&auto=format&fit=crop",
    ask: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop" // Mystic AI / purple energy
  };

  const themeMap = {
    person: "from-indigo-950/20 via-black to-slate-950",
    reports: "from-blue-950/20 via-black to-cyan-950/10",
    panchang: "from-amber-950/40 via-orange-950/20 to-rose-950/30", // Sunset gradient
    union: "from-pink-950/20 via-black to-rose-950/10",
    palmistry: "from-violet-950/20 via-black to-purple-950/10",
    tarot: "from-purple-950/40 via-fuchsia-950/20 to-indigo-950/40", // Deep purple / nebula
    week: "from-indigo-950/20 via-black to-blue-950/10",
    month: "from-slate-900/30 via-black to-slate-950",
    ask: "from-fuchsia-950/40 via-purple-950/20 to-violet-950/40" // Mystic purple/AI
  };

  const accentColorMap = {
    person: "#4f46e5",
    reports: "#0284c7",
    panchang: "#fbbf24",
    union: "#ec4899",
    palmistry: "#8b5cf6",
    tarot: "#d946ef",
    week: "#4f46e5",
    month: "#334155",
    ask: "#c026d3"
  };

  const activeTheme = themeMap[tb] || "from-black via-black to-black";
  const activeAccent = accentColorMap[tb] || "#4f46e5";

  // Use CSS Variables for dynamic styling
  React.useEffect(() => {
    document.documentElement.style.setProperty('--theme-accent', activeAccent);
    document.documentElement.style.setProperty('--theme-accent-light', activeAccent + '40'); // 25% opacity
    document.documentElement.style.setProperty('--theme-accent-faint', activeAccent + '15'); // 8% opacity
  }, [activeAccent]);


  return (
    
    
    <Fragment>
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 ${activeTheme} opacity-90`}></div>

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
            style={tb === t.id ? { backgroundColor: 'var(--theme-accent)', color: '#fff', boxShadow: '0 4px 20px var(--theme-accent-light)' } : {}}
            className={`flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 transition-all text-xs ${
              tb === t.id ? "font-bold" : "text-slate-400 hover:text-white hover:bg-white/5"
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
      {tb === "palmistry" && <PalmistryTab pr={pr} settings={settings} emHash={u?.emailHash} />}
      {tb === "tarot" && <TarotTab settings={settings} emHash={u?.emailHash} />}
      {tb === "week" && <WeekTab pr={pr} ch={ch} />}
      {tb === "month" && <MonthTab pr={pr} ch={ch} />}
      {tb === "ask" && <AskTab em={u.email} emHash={u.emailHash} set={settings} pr={pr} ch={ch} date={date} />}
    </Fragment>
  );
};
