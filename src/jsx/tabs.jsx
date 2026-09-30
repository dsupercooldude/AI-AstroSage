// src/jsx/tabs.jsx
import { motion, AnimatePresence } from 'motion/react';
var React = window.React;
var { useState, useEffect, Fragment, useMemo } = window.React;

window.TabOrchestrator = ({ pr, ch, date, setDate, settings, onEditProfile, prs, chs, u, setU, updateSettings, lang: propLang }) => {
  const { PersonTab, ReportsTab, PanchangTab, CompatTab, AskTab, WeekTab, MonthTab, PalmistryTab, TarotTab, RemediesTab } = window;
  const [tb, setTb] = useState("person");
  const [lang, setLang] = useState(() => propLang || (window.getLanguage ? window.getLanguage() : "en"));

  // Collapsible sidebar state with local storage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('gl_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('gl_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Keyboard shortcut: Pressing '[' toggles sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      if (e.key === '[') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (propLang) setLang(propLang);
  }, [propLang]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('tabChanged', { detail: tb }));
  }, [tb]);

  useEffect(() => {
    const handleLangChange = (e) => {
      setLang(e.detail || (window.getLanguage ? window.getLanguage() : "en"));
    };
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  if (settings && typeof window !== 'undefined') {
    window.getSettings = () => settings;
  }

  const themeMap = {
    person: "from-indigo-950/20 via-black to-slate-950",
    reports: "from-blue-950/20 via-black to-cyan-950/10",
    panchang: "from-amber-950/40 via-orange-950/20 to-rose-950/30",
    union: "from-pink-950/20 via-black to-rose-950/10",
    palmistry: "from-violet-950/20 via-black to-purple-950/10",
    tarot: "from-purple-950/40 via-fuchsia-950/20 to-indigo-950/40",
    week: "from-indigo-950/20 via-black to-blue-950/10",
    month: "from-slate-900/30 via-black to-slate-950",
    ask: "from-fuchsia-950/40 via-purple-950/20 to-violet-950/40"
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
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-accent', activeAccent);
    document.documentElement.style.setProperty('--theme-accent-light', activeAccent + '40');
    document.documentElement.style.setProperty('--theme-accent-faint', activeAccent + '15');
  }, [activeAccent]);

  const tabsList = useMemo(() => [
    { id: "person", key: "astrologyDasha", defaultLabel: "Astrology & Dasha", icon: "planet", group: "Foundation", badge: "D1/D9" },
    { id: "remedies", key: "dailyRemedies", defaultLabel: "Daily Remedies", icon: "sparkle", group: "Foundation", badge: "Upaya" },
    { id: "reports", key: "advancedReports", defaultLabel: "Advanced Reports", icon: "file-text", group: "Foundation", badge: "Dossier" },
    { id: "panchang", key: "panchangMuhurta", defaultLabel: "Panchang & Muhurta", icon: "calendar", group: "Foundation", badge: "Tithi" },
    { id: "union", key: "unionMilan", defaultLabel: "Union Milan", icon: "heart", group: "Divination", badge: "Milan" },
    { id: "palmistry", key: "handPalmistry", defaultLabel: "Hand Palmistry", icon: "hand", group: "Divination", badge: "Scanner" },
    { id: "tarot", key: "tarotOracle", defaultLabel: "Tarot Oracle", icon: "cards", group: "Divination", badge: "Arcana" },
    { id: "week", key: "sevenDayAi", defaultLabel: "7-Day AI", icon: "sparkle", group: "Predictions", badge: "Weekly" },
    { id: "month", key: "thirtyDayMacro", defaultLabel: "30-Day Macro", icon: "chart-line", group: "Predictions", badge: "Macro" },
    { id: "ask", key: "vedicAiSage", defaultLabel: "Vedic AI Sage", icon: "chat-circle-dots", group: "Predictions", badge: "AI" }
  ], []);

  // Distinct groups for structured display in expanded mode
  const tabGroups = useMemo(() => {
    const groups = [];
    tabsList.forEach(t => {
      if (!groups.includes(t.group)) groups.push(t.group);
    });
    return groups;
  }, [tabsList]);

  const currentTabObj = tabsList.find(t => t.id === tb) || tabsList[0];
  const currentLabel = window.t ? window.t(currentTabObj.key, lang, currentTabObj.defaultLabel) : currentTabObj.defaultLabel;

  return (
    <Fragment>
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 ${activeTheme} opacity-90`}></div>

      {/* MOBILE COMPACT BAR (Displays on mobile screens < md) */}
      <div className="md:hidden flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded-2xl p-2.5 mb-4 shadow-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <div 
            style={{ color: 'var(--theme-accent)' }} 
            className="w-8 h-8 rounded-xl bg-white/5 border border-[#27272a] flex items-center justify-center shrink-0 shadow-inner"
          >
            <window.Icon name={currentTabObj.icon} size={18} />
          </div>
          <div className="truncate">
            <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider leading-none mb-0.5">Active Tab</span>
            <span className="text-xs font-bold text-white truncate block">{currentLabel}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition border border-white/10 shrink-0"
        >
          <window.Icon name="sidebar" size={14} />
          <span>Tabs ({tabsList.length})</span>
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm md:hidden flex justify-start p-3"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div 
            className="w-full max-w-xs bg-[#18181b] border border-[#27272a] rounded-3xl p-4 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto gl-fadein"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <window.Icon name="sidebar" size={18} className="text-indigo-400" />
                <h3 className="font-serif text-base text-white font-bold">Select Module</h3>
              </div>
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <window.Icon name="x" size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {tabGroups.map(grp => (
                <div key={grp}>
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold px-2 mb-1.5 tracking-wider">
                    {grp}
                  </div>
                  <div className="space-y-1">
                    {tabsList.filter(t => t.group === grp).map(t => {
                      const label = window.t ? window.t(t.key, lang, t.defaultLabel) : t.defaultLabel;
                      const isCur = tb === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTb(t.id);
                            setMobileDrawerOpen(false);
                          }}
                          style={isCur ? { 
                            borderColor: 'var(--theme-accent)', 
                            background: 'linear-gradient(to right, var(--theme-accent-faint), transparent)' 
                          } : {}}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left text-xs ${
                            isCur 
                              ? "font-bold text-white border border-[#27272a]" 
                              : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div 
                              style={isCur ? { color: 'var(--theme-accent)' } : {}}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCur ? 'bg-white/10' : 'bg-black/30'}`}
                            >
                              <window.Icon name={t.icon} size={15} />
                            </div>
                            <span className="truncate">{label}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isCur ? 'text-white/80 bg-white/10' : 'text-slate-400 bg-black/40'}`}>
                            {t.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR + CONTENT SPLIT CONTAINER */}
      <div className="flex flex-col md:flex-row gap-5 items-start w-full">
        {/* LEFT COLLAPSIBLE SIDEBAR (md: and up) */}
        <aside 
          aria-label="Navigation Tabs"
          className={`hidden md:flex flex-col justify-between shrink-0 bg-[#18181b]/95 backdrop-blur-md rounded-2xl border border-[#27272a] shadow-2xl transition-all duration-300 ease-in-out sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto ${
            isCollapsed ? "w-[68px] p-2" : "w-60 lg:w-64 p-3"
          }`}
        >
          <div>
            {/* SIDEBAR HEADER & TOGGLE */}
            {isCollapsed ? (
              <div className="flex flex-col items-center pb-2.5 border-b border-[#27272a] mb-2.5">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  title="Expand sidebar ([)"
                  className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center border border-transparent hover:border-[#27272a]"
                >
                  <window.Icon name="sidebar" size={17} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pb-2.5 border-b border-[#27272a] mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <window.Icon name="sidebar" size={16} className="text-slate-400" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                    Tabs
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  title="Collapse sidebar ([)"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center border border-transparent hover:border-[#27272a]"
                >
                  <window.Icon name="caret-double-left" size={14} />
                </button>
              </div>
            )}

            {/* TAB BUTTONS LIST */}
            {isCollapsed ? (
              <div className="space-y-1.5 py-1">
                {tabsList.map(t => {
                  const label = window.t ? window.t(t.key, lang, t.defaultLabel) : t.defaultLabel;
                  const isCur = tb === t.id;
                  return (
                    <div key={t.id} className="relative group">
                      <button
                        type="button"
                        onClick={() => setTb(t.id)}
                        style={isCur ? { 
                          borderColor: 'var(--theme-accent)', 
                          backgroundColor: 'var(--theme-accent-faint)',
                          boxShadow: '0 0 16px var(--theme-accent-light)'
                        } : {}}
                        className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-all ${
                          isCur 
                            ? "font-bold text-white border border-[#27272a]" 
                            : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                        aria-label={label}
                      >
                        <div style={isCur ? { color: 'var(--theme-accent)' } : {}}>
                          <window.Icon name={t.icon} size={18} />
                        </div>
                      </button>

                      {/* Tooltip on hover when collapsed */}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex items-center z-50 pointer-events-none">
                        <div className="bg-[#18181b] border border-[#27272a] text-white text-xs font-medium px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap font-mono flex items-center gap-2">
                          <span className="font-bold">{label}</span>
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-black/40 border border-[#27272a]">
                            {t.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3.5 py-1">
                {tabGroups.map(grp => (
                  <div key={grp} className="space-y-1">
                    <div className="text-[9px] font-mono uppercase text-slate-400 font-bold px-2 tracking-wider flex items-center justify-between">
                      <span>{grp}</span>
                    </div>
                    {tabsList.filter(t => t.group === grp).map(t => {
                      const label = window.t ? window.t(t.key, lang, t.defaultLabel) : t.defaultLabel;
                      const isCur = tb === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTb(t.id)}
                          style={isCur ? { 
                            borderColor: 'var(--theme-accent)', 
                            background: 'linear-gradient(to right, var(--theme-accent-faint), transparent)',
                            boxShadow: 'inset 3px 0 0 var(--theme-accent)'
                          } : {}}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition text-left text-xs group ${
                            isCur 
                              ? "font-bold text-white bg-white/5 border border-[#27272a]" 
                              : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div 
                              style={isCur ? { color: 'var(--theme-accent)' } : {}}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                                isCur ? 'bg-white/10' : 'bg-black/30 group-hover:bg-white/5 text-slate-400'
                              }`}
                            >
                              <window.Icon name={t.icon} size={15} />
                            </div>
                            <span className="truncate">{label}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition ${
                            isCur ? 'text-white/80 bg-white/10' : 'text-slate-400 bg-black/40 group-hover:text-slate-300'
                          }`}>
                            {t.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR FOOTER ACTION */}
          <div className="pt-2 mt-2 border-t border-[#27272a]">
            {isCollapsed ? (
              <button
                type="button"
                onClick={toggleSidebar}
                title="Expand Sidebar ([)"
                className="w-10 h-8 mx-auto rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition flex items-center justify-center"
              >
                <window.Icon name="caret-double-right" size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleSidebar}
                title="Collapse to icons only ([)"
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-mono text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition border border-transparent hover:border-[#27272a]"
              >
                <span className="flex items-center gap-1.5">
                  <window.Icon name="sidebar" size={13} />
                  <span>Collapse</span>
                </span>
                <span className="text-[10px] text-slate-400 bg-black/40 px-1 py-0.5 rounded border border-[#27272a]">
                  [
                </span>
              </button>
            )}
          </div>
        </aside>

        {/* MAIN TAB CONTENT AREA */}
        <section className="flex-1 min-w-0 w-full" aria-label="Tab Content">
          <AnimatePresence mode="wait">
            <motion.div
              key={tb}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {tb === "person" && <PersonTab pr={pr} ch={ch} date={date} setDate={setDate} settings={settings} onEdit={onEditProfile} bioScores={window.bio ? window.bio(pr?.dob, date, pr?.utcOffset) : {p:0,e:0,i:0}} lang={lang} />}
              {tb === "remedies" && <RemediesTab pr={pr} ch={ch} date={date} lang={lang} />}
              {tb === "reports" && <ReportsTab pr={pr} ch={ch} date={date} lang={lang} />}
              {tb === "panchang" && <PanchangTab d={date} setDate={setDate} p={pr} utc={pr?.utcOffset || 5.5} settings={settings} lang={lang} />}
              {tb === "union" && <CompatTab prs={prs} chs={chs} settings={settings} date={date} lang={lang} />}
              {tb === "palmistry" && <PalmistryTab pr={pr} settings={settings} emHash={u?.emailHash || "guest_vault_default"} lang={lang} />}
              {tb === "tarot" && <TarotTab settings={settings} emHash={u?.emailHash || "guest_vault_default"} pr={pr} lang={lang} />}
              {tb === "week" && <WeekTab pr={pr} ch={ch} settings={settings} emHash={u?.emailHash || "guest_vault_default"} lang={lang} />}
              {tb === "month" && <MonthTab pr={pr} ch={ch} settings={settings} emHash={u?.emailHash || "guest_vault_default"} lang={lang} />}
              {tb === "ask" && <AskTab em={u?.email || "guest@grahaledger.internal"} emHash={u?.emailHash || "guest_vault_default"} set={settings} pr={pr} ch={ch} date={date} lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </Fragment>
  );
};
