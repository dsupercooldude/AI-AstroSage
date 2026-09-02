// src/jsx/tab-ask.jsx
var React = window.React;
var { useState, useEffect, useRef } = window.React;

window.AskTab = ({ emHash, set, pr, ch, date }) => {
  const { Icon, AppDB, CryptoUtils, WEEKDAY, executeMultiProviderAI, runVedicRuleEngine } = window;
  const [q, setQ] = useState("");
  const [shareData, setShareData] = useState(true);
  const [h, setH] = useState([]);
  const [l, setL] = useState(false);
  const [isMic, setIsMic] = useState(false);
  const [view, setView] = useState("chat");
  const [sumL, setSumL] = useState(false);
  const [summary, setSummary] = useState(null);
  const scrollRef = useRef(null);

  // Load chat history from encrypted vault
  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const chatsFile = await AppDB.getFile(`gl_chats_${emHash}.json`);
        const decH = typeof chatsFile.content.h === "string" ? await CryptoUtils.decrypt(chatsFile.content.h) : chatsFile.content.h || [];
        if (isMounted && decH) setH(decH);
      } catch (e) {}
    };
    loadHistory();
    return () => { isMounted = false; };
  }, [emHash]);

  // Auto-scroll to latest response
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [h]);

  const startListening = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return alert("Voice input not supported in this browser.");
    const rec = new SpeechRec();
    setIsMic(true);
    rec.onresult = (e) => { setQ(e.results[0][0].transcript); setIsMic(false); };
    rec.onerror = () => setIsMic(false);
    rec.onend = () => setIsMic(false);
    rec.start();
  };

  async function ask(e) {
    if (e) e.preventDefault();
    if (!q.trim() || l) return;
    if (window.updateOfflineRules) window.updateOfflineRules(q.trim(), "");
    const userPrompt = q.trim();
    setL(true);
    let ans = "";
    let usedProvider = set?.aiModel || "offline";
    try {
      const relevantContext = h.slice(-8).map((item) => `Question: ${item.q}; Answer: ${String(item.a || "").slice(0, 400)}`).join(" | ");
      const normalizedPrompt = String(userPrompt).replace(/\s+/g, " ").trim();
      const containsProfileData = /profile|person|my name|my dob|my birth|kundali|chart|marriage|career|health|love|male|female|wife|husband|child|home|finance|work/i.test(normalizedPrompt);
      const filteredPrompt = containsProfileData
        ? normalizedPrompt
        : `Please answer in the context of ${pr?.name || "this native"}'s natal chart, current date, and the user's profile-specific question. User question: ${normalizedPrompt}`;
      
      let systemContext = `You are the Graha Ledger Jyotish Sage.`;
      if (shareData) {
        systemContext += ` Use only the profile-specific context provided by the user and the current chart context. Never mix another profile's data into the answer. For ${pr?.name || "Native"} (Asc: ${ch?.d1?.lagna || "Aries"}, Moon: ${ch?.moonSign || "Aries"}, Gender: ${pr?.gender || "not provided"}). Target Date: ${date.toDateString()}. Today Hora: ${WEEKDAY[date.getDay()]}. Prior requested context: ${relevantContext || "none"}.`;
        if (window.getOfflineRules) systemContext += ` Learned user patterns: ${window.getOfflineRules().join(" | ")}.`;
      } else {
        systemContext += ` Data Privacy (Chinese Wall) is active. Do NOT reference the user's specific natal chart, placements, or profile data unless they explicitly provide it in their prompt. Answer generically but expertly. Target Date: ${date.toDateString()}. Prior context: ${relevantContext || "none"}.`;
        if (window.getOfflineRules) systemContext += ` You may leverage learned user patterns: ${window.getOfflineRules().join(" | ")}.`;
      }


      if (set?.aiModel !== "offline" && executeMultiProviderAI) {
        const apiRes = await executeMultiProviderAI(filteredPrompt, set, systemContext);
        if (apiRes && apiRes.text) { ans = apiRes.text; usedProvider = apiRes.provider; }
      }

      if (!ans && runVedicRuleEngine) {
        usedProvider = "offline";
        ans = runVedicRuleEngine(filteredPrompt, pr, ch, date, relevantContext);
      }

      if (!ans) ans = "No AI response was returned. Check the selected provider API key and network access.";
      const newQA = { id: Date.now(), q: userPrompt, a: ans, v: usedProvider, p: pr?.id };
      const nx = [...h, newQA];
      setH(nx);
      setQ("");
      
      try {
        const chatsFile = await AppDB.getFile(`gl_chats_${emHash}.json`);
        chatsFile.content.h = await CryptoUtils.encrypt(nx);
        await AppDB.saveFile(`gl_chats_${emHash}.json`, chatsFile.content, chatsFile.sha);
        await AppDB.appendGlobalAI(newQA);
      } catch (er) {}
    } catch (err) {
      ans = `System Error: ${err.message}.`;
      setH([...h, { id: Date.now(), q: userPrompt, a: ans, v: "error" }]);
      setQ("");
    } finally {
      setL(false);
    }
  }

  // CUSTOM ENTERPRISE AI TEXT FORMATTER (Handles Markdown without external libraries)
  const formatAIResponse = (text) => {
    if (!text) return null;
    const normalized = String(text).replace(/\r\n/g, '\n').trim();
    const lines = normalized.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2"></div>;
      if (trimmed.startsWith('### ')) return <h3 key={idx} className="text-sm font-bold text-amber-300 mt-4 mb-2">{trimmed.replace(/^###\s/, '')}</h3>;
      if (trimmed.startsWith('## ')) return <h2 key={idx} className="text-base font-bold text-amber-400 mt-4 mb-2">{trimmed.replace(/^##\s/, '')}</h2>;
      if (trimmed.startsWith('# ')) return <h1 key={idx} className="text-lg font-bold text-amber-500 mt-4 mb-2 border-b border-[#27272a] pb-1">{trimmed.replace(/^#\s/, '')}</h1>;
      if (/^\*\s|^-\s/.test(trimmed)) {
        const content = trimmed.replace(/^[-*]\s/, '');
        const parts = content.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-amber-200 font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        return <div key={idx} className="flex gap-2 mt-1.5 mb-1.5 pl-2"><span className="text-amber-500 mt-0.5">•</span><span className="text-white/80">{parts}</span></div>;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const content = trimmed.replace(/^\d+\.\s/, '');
        const parts = content.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-amber-200 font-bold">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        return <div key={idx} className="mt-1.5 mb-1.5 pl-2 text-white/80 font-medium">{parts}</div>;
      }
      const parts = trimmed.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-amber-200 font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <div key={idx} className="mb-2 leading-relaxed text-white/80">{parts}</div>;
    });
  };

  return (
    <div className="space-y-4 pb-12 gl-fadein mt-4">
      <style>{`
        .beauty-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .beauty-scroll::-webkit-scrollbar-track { background: transparent; }
        .beauty-scroll::-webkit-scrollbar-thumb { background-color: rgba(251, 191, 36, 0.2); border-radius: 10px; }
      `}</style>

      {/* HEADER WIDGET */}
      <div style={{ borderColor: 'var(--theme-accent-light)', background: 'linear-gradient(to bottom right, var(--theme-accent-faint), rgba(0,0,0,0.2), transparent)' }} className="rounded-3xl border p-5 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <span style={{ color: 'var(--theme-accent)' }} className="font-mono text-[9px] uppercase tracking-[0.2em]">Global Learning AI</span>
            <div className="flex items-center gap-4 mt-0.5">
              <h2 style={{ color: 'var(--theme-accent-light)' }} className="font-serif text-2xl">Ask the Sage</h2>
              <div className="flex bg-black/40 p-1 rounded-xl border border-[#27272a]">
                <button onClick={() => setView('chat')} className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase transition ${view === 'chat' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>Chat</button>
                <button onClick={() => setView('summary')} className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase transition ${view === 'summary' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>AI Summary</button>
              </div>
            </div>
          </div>
          <span style={{ color: 'var(--theme-accent)' }} className="text-[10px] font-mono bg-white/5 border border-[#27272a] px-2.5 py-1 rounded-full uppercase shadow-inner flex items-center gap-1.5">
            <Icon name="brain" /> {set?.aiModel || "offline"}
          </span>
        </div>
      </div>
      
      
      {view === 'chat' ? (
        <>
          {/* QUICK SUGGESTIONS */}
          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 text-[10px] font-mono beauty-scroll">
            <button onClick={() => setQ("Will I be able to achieve my Year's Target for the mentioned commission letter?")} className="whitespace-nowrap px-3 py-1.5 bg-black/40 border border-[#27272a] rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">Suggest: Yearly Targets?</button>
            <button onClick={() => setQ("How does my career look this week?")} className="whitespace-nowrap px-3 py-1.5 bg-black/40 border border-[#27272a] rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">Suggest: Career Week?</button>
            <button onClick={() => setQ("How will my marriage go and will my wife be accepted in the household?")} className="whitespace-nowrap px-3 py-1.5 bg-black/40 border border-[#27272a] rounded-full hover:bg-white/10 text-white/70 hover:text-white transition">Suggest: Marriage & Home?</button>
          </div>
          
          {/* AI CHAT LOG */}
          <div ref={scrollRef} className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 beauty-scroll scroll-smooth">
            {h.filter(x => !x.p || x.p === pr?.id).map((x, index, arr) => (
              <details key={x.id} className="bg-[#18181b] rounded-2xl border border-[#27272a] overflow-hidden group shadow-lg" open={index === arr.length - 1}>
                <summary style={{ color: 'var(--theme-accent)' }} className="p-4 font-bold cursor-pointer flex justify-between items-start outline-none bg-black/20 hover:bg-black/40 transition select-none">
                  <span className="pr-4 flex gap-2 items-center"><Icon name="user" className="mt-0.5" /> <span className="text-sm font-sans text-white">{x.q}</span> {x.r && <window.SectionConfidence score={92} type="ai" label="Vedic Sage AI" />} </span>
                  <Icon name="caret-down" className="group-open:rotate-180 transition-transform mt-0.5 shrink-0 text-white/40" />
                </summary>
                <div className="p-6 border-t border-[#27272a] bg-[#0e101f] text-sm font-sans shadow-inner">
                  <div className="ai-response-body">
                    {formatAIResponse(x.a)}
                  </div>
                  <div className="flex justify-end mt-6 pt-3 border-t border-[#27272a] gap-2">
                    <button type="button" onClick={() => navigator.clipboard?.writeText(`${x.q}\n\n${x.a}`)} className="text-[9px] text-emerald-300 font-mono uppercase bg-emerald-900/20 px-2.5 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                      <Icon name="copy" /> Copy
                    </button>
                    <span className="text-[9px] font-mono uppercase px-2.5 py-1 rounded border flex items-center gap-1" style={{ color: 'var(--theme-accent)', backgroundColor: 'var(--theme-accent-faint)', borderColor: 'var(--theme-accent-light)' }}>
                      <Icon name="cpu" /> Engine: {x.v}
                    </span>
                  </div>
                </div>
              </details>
            ))}
            
            {/* LOADING INDICATOR */}
            {l && (
              <div className="p-5 bg-[#18181b] rounded-2xl border border-[#27272a] flex items-center gap-3 shadow-lg">
                <div style={{ borderTopColor: 'transparent', borderColor: 'var(--theme-accent-light)' }} className="w-5 h-5 border-2 rounded-full animate-spin"></div>
                <div style={{ color: 'var(--theme-accent-light)' }} className="text-xs font-mono animate-pulse">Synthesizing astrological coordinates & querying the Vedic Engine...</div>
              </div>
            )}
          </div>
          
          {/* INPUT FORM */}
          <form onSubmit={ask} className="flex gap-2 p-2 bg-[#09090b] border border-[#27272a] rounded-2xl shadow-2xl mt-2">
            <button type="button" onClick={startListening} className={`px-3 py-2 rounded-xl transition flex items-center justify-center ${isMic ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20" : "bg-black/30 hover:bg-white/10"}`} style={!isMic ? { color: 'var(--theme-accent)' } : {}}>
              <Icon name="microphone" size={20} />
            </button>
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Ask about 2026 transits, targets, marriage..." 
              className="flex-1 bg-transparent text-sm focus:outline-none px-2 text-white font-sans placeholder-white/30" 
            />
            <button type="submit" disabled={l || !q.trim()} style={{ backgroundColor: 'var(--theme-accent)' }} className="px-6 py-2.5 text-black text-sm font-bold rounded-xl disabled:opacity-50 hover:opacity-80 transition shadow-lg flex items-center gap-2">
              Ask <Icon name="paper-plane-right" />
            </button>
          </form>
        </>
      ) : (
        <div className="bg-[#18181b] rounded-3xl border border-[#27272a] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon name="brain" size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center w-full mb-2"><h3 className="font-serif text-xl text-white">Profile Synthesis: {pr?.name}</h3><window.SectionConfidence score={95} type="ai" label="AI Sage" /></div>
            <p className="text-sm text-slate-400 mb-6 max-w-2xl">
              Generate a comprehensive analytical summary based strictly on the chat history associated with this profile. Questions asked under other profiles are discarded.
            </p>
            
            <div className="flex gap-3 mb-6">
              <button 
                onClick={async () => {
                  if (!executeMultiProviderAI) return alert("AI Engine not configured or offline.");
                  setSumL(true);
                  try {
                    const profileChats = h.filter(x => !x.p || x.p === pr?.id);
                    if (profileChats.length === 0) {
                      setSummary("No questions have been asked for this profile yet. Chat with the Sage to build history.");
                      return;
                    }
                    const context = profileChats.map(c => `Q: ${c.q}\nA: ${c.a}`).join("\n\n");
                    const res = await executeMultiProviderAI(
                      "Based on the following past questions and astrological interpretations for this person, write a high-level executive summary of their core life themes, challenges, and predicted opportunities. Format with Markdown.\n\n" + context,
                      set,
                      "You are an expert Vedic Astrologer synthesizing a client profile."
                    );
                    setSummary(res?.text || "Synthesis failed.");
                  } catch (e) {
                    setSummary("Error: " + e.message);
                  } finally {
                    setSumL(false);
                  }
                }}
                disabled={sumL}
                style={{ backgroundColor: 'var(--theme-accent)' }}
                className="px-6 py-2.5 text-black font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition flex items-center gap-2 shadow-lg"
              >
                {sumL ? (
                  <><div style={{ borderTopColor: 'transparent', borderColor: 'black' }} className="w-4 h-4 border-2 rounded-full animate-spin"></div> Synthesizing...</>
                ) : (
                  <><Icon name="sparkle" /> Generate Profile Summary</>
                )}
              </button>
            </div>
            
            {summary && (
              <div className="bg-[#0e101f] rounded-2xl border border-[#27272a] p-6 shadow-inner ai-response-body text-sm font-sans">
                {formatAIResponse(summary)}
              </div>
            )}
          </div>
        </div>
      )}
</div>
  );
};
