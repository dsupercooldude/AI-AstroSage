// src/jsx/tabs.jsx
var React = window.React;
var { useState, Fragment } = window.React;

window.TabOrchestrator = ({ pr, ch, date, setDate, settings, onEditProfile, prs, chs, u, setU, updateSettings }) => {
  const { PersonTab, ReportsTab, PanchangTab, CompatTab, AskTab, WeekTab, MonthTab, PalmistryTab, TarotTab } = window;
  const [tb, setTb] = useState("person");

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
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 ${activeTheme}`}></div>
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
