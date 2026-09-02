// src/jsx/app.jsx
let bootAttempts = 0;
const bootInterval = setInterval(() => {
  bootAttempts++;
  const deps = {
    React: !!window.React,
    ReactDOM: !!window.ReactDOM,
    ErrorBoundary: !!window.ErrorBoundary,
    KundaliRenderer: !!window.KundaliRenderer,
    SetupModal: !!window.SetupModal,
    AuthModal: !!window.AuthModal,
    SettingsModal: !!window.SettingsModal,
    GhostPDFReport: !!window.GhostPDFReport,
    PersonTab: !!window.PersonTab,
    PanchangTab: !!window.PanchangTab,
    CompatTab: !!window.CompatTab,
    PalmistryTab: !!window.PalmistryTab,
    AskTab: !!window.AskTab,
    ReportsTab: !!window.ReportsTab,
    WeekTab: !!window.WeekTab,
    MonthTab: !!window.MonthTab,
    TabOrchestrator: !!window.TabOrchestrator
  };

  const criticalReady = deps.React && deps.ReactDOM && deps.SetupModal && deps.AuthModal && deps.TabOrchestrator;
  const allReady = Object.values(deps).every(Boolean);

  if (allReady || (criticalReady && bootAttempts > 20)) {
    clearInterval(bootInterval);
    const bootloader = document.getElementById("bootloader");
    if (bootloader) bootloader.style.display = "none";

    const { ErrorBoundary, SetupModal, AuthModal, ForcePasswordChange, AdminAuthModal, AdminConsoleModal, SettingsModal, TabOrchestrator, SageLogo, Icon, AppDB, CryptoUtils, GhostPDFReport } = window;
    var { useState, useEffect, useMemo, useRef, Fragment } = window.React;

    function AppContent() {
      const [dbC, setDbC] = useState(() => AppDB.loadConfig()); const [u, setU] = useState(null); const [dt, setDt] = useState(new Date()); const [ss, setSs] = useState(false);

  useEffect(() => {
    const handleTokenUsage = async (e) => {
      if (!u || !u.emailHash) return;
      try {
        const { engine, tokens } = e.detail;
        let authFile = await window.AppDB.getFile('gl_auth.json');
        if (!authFile.content.users[u.emailHash].settings) authFile.content.users[u.emailHash].settings = {};
        if (!authFile.content.users[u.emailHash].settings.tokenUsage) authFile.content.users[u.emailHash].settings.tokenUsage = {};
        const cur = authFile.content.users[u.emailHash].settings.tokenUsage[engine] || 0;
        authFile.content.users[u.emailHash].settings.tokenUsage[engine] = cur + tokens;
        await window.AppDB.saveFile('gl_auth.json', authFile.content, authFile.sha);
        // Also update local state so SettingsModal reflects it
        setU(prev => {
           const next = {...prev};
           if (!next.settings) next.settings = {};
           if (!next.settings.tokenUsage) next.settings.tokenUsage = {};
           next.settings.tokenUsage[engine] = (next.settings.tokenUsage[engine] || 0) + tokens;
           return next;
        });
      } catch (err) {
        console.error("Token usage save failed", err);
      }
    };
    window.addEventListener('aiTokenUsage', handleTokenUsage);
    return () => window.removeEventListener('aiTokenUsage', handleTokenUsage);
  }, [u]);
 const [ed, setEd] = useState(null); const [activeProfileId, setActiveProfileId] = useState(null); const [adminAuthOpen, setAdminAuthOpen] = useState(false); const [adminConsoleOpen, setAdminConsoleOpen] = useState(false);
      const [formData, setFormData] = useState({ name: "", dob: "2000-01-01", time: "12:00", place: "", lat: "", lon: "", utcOffset: "5.5", gotra: "", jaati: "", kulDevta: "", gramDevta: "", sthanDevta: "", sunOverride: "", moonOverride: "", ascOverride: "", associatedProfileId: "", associatedRelation: "" });
      const settingsSaveChain = useRef(Promise.resolve());

      window.useIdleTimeout(() => { if (u) { try { localStorage.removeItem("gl_active_user"); } catch (e) {} setU(null); alert("Session timed out."); } }, 300000);

      useEffect(() => {
        const fetchVaultIfConfigured = async () => {
          if (dbC) {
            try {
              const sess = localStorage.getItem("gl_active_user");
              if (sess) {
                const pS = JSON.parse(sess); const vaultFile = await AppDB.getFile(`gl_vault_${pS.emailHash}.json`);
                let pr = []; try { const decodedProfiles = typeof vaultFile.content.profiles === "string" ? await CryptoUtils.decrypt(vaultFile.content.profiles) : vaultFile.content.profiles; pr = typeof decodedProfiles === "string" ? JSON.parse(decodedProfiles) : decodedProfiles || []; } catch(e){}
                let se = {}; try { const decodedSettings = typeof vaultFile.content.settings === "string" ? await CryptoUtils.decrypt(vaultFile.content.settings) : vaultFile.content.settings; se = typeof decodedSettings === "string" ? JSON.parse(decodedSettings) : decodedSettings || {}; } catch(e){}
                setU({ email: pS.email, emailHash: pS.emailHash, profiles: pr, settings: { aiModel: "auto", monthSystem: "amanta", kundaliStyle: "north", apiKeys: {}, ...se, apiKeys: { ...(se.apiKeys || {}) } }, mfaEnabled: pS.mfaEnabled });
                if (pr.length) setActiveProfileId(pr[0].id);
              }
            } catch (e) {}
          }
        };
        fetchVaultIfConfigured();
      }, [dbC]);

      const prs = Array.isArray(u?.profiles) ? u.profiles : [];
      const set = u?.settings || { aiModel: "auto", monthSystem: "amanta", kundaliStyle: "north", apiKeys: {} };
      const chs = useMemo(() => { const o = {}; if (Array.isArray(prs)) { prs.forEach((p) => { if (p && p.id && window.computeKundli) { o[p.id] = window.computeKundli(p, dt); } }); } return o; }, [prs, dt]);
      const aP = prs.find((p) => p.id === activeProfileId) || (prs.length > 0 ? prs[0] : null);

      // FIX: Seamless Off-Screen Multi-Page PDF Capture with background painting
      useEffect(() => {
        const handlePdf = async () => {
          window.dispatchEvent(new Event("refreshPdfData"));

          const el = document.getElementById('pdf-render-target'); 
          if (!el) return; 
          
          el.classList.remove('hidden'); 
          
          const loader = document.createElement('div');
          loader.id = 'pdf-loader-overlay';
          loader.innerHTML = `
            <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
            <div style="position:fixed;inset:0;z-index:99999;background:rgba(11,13,25,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fbbf24;font-family:monospace;font-size:14px;">
              <div style="width:50px;height:50px;border:4px solid #fbbf24;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div>
              Generating Personal Dossier...
            </div>
          `;
          document.body.appendChild(loader);

          await new Promise(resolve => setTimeout(resolve, 1000)); 

          try {
            const validation = await window.PDFValidator.validate(el);
            if (!validation.valid) {
              alert(`PDF layout validation failed:\n\n${window.PDFValidator.formatIssues(validation)}`);
              return;
            }
            const pdf = new window.jspdf.jsPDF('p', 'pt', 'a4');
            const pages = el.querySelectorAll('.pdf-page');
            
            for (let i = 0; i < pages.length; i++) {
              const captureWidth = Math.max(pages[i].clientWidth, pages[i].scrollWidth);
              const captureHeight = Math.max(pages[i].clientHeight, pages[i].scrollHeight);
              const canvas = await window.html2canvas(pages[i], { scale: 2, width: captureWidth, height: captureHeight, windowWidth: captureWidth, windowHeight: captureHeight, useCORS: true, backgroundColor: '#0b0d19', logging: false });
              const imgData = canvas.toDataURL('image/jpeg', 1.0); 
              
              if (i > 0) pdf.addPage();
              
              const pdfWidth = pdf.internal.pageSize.getWidth(); 
              const pdfHeight = pdf.internal.pageSize.getHeight();
              
              // Paint the literal PDF paper dark to prevent white gaps
              pdf.setFillColor(11, 13, 25);
              pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

              const imgHeight = (canvas.height * pdfWidth) / canvas.width;
              const fitScale = Math.min(1, pdfHeight / imgHeight);
              const drawWidth = pdfWidth * fitScale;
              const drawHeight = imgHeight * fitScale;
              pdf.addImage(imgData, 'JPEG', (pdfWidth - drawWidth) / 2, 0, drawWidth, drawHeight);
            }
            
            pdf.save(`${aP?.name?.replace(/\s+/g, '_') || 'Graha_Ledger'}_Astrology_Report.pdf`);
          } catch(e) { 
            alert("PDF Generation Failed."); 
            console.error(e);
          } finally { 
            el.classList.add('hidden'); 
            const overlay = document.getElementById('pdf-loader-overlay');
            if (overlay) overlay.remove();
          }
        };
        window.addEventListener('generate-pdf', handlePdf); 
        return () => window.removeEventListener('generate-pdf', handlePdf);
      }, [aP]);

      const logoutUser = () => { try { localStorage.removeItem("gl_active_user"); } catch (e) {} setU(null); };
      const handleOpenEdit = (profileObj = {}) => { setFormData({ id: profileObj.id || null, name: profileObj.name || "", dob: profileObj.dob || "2000-01-01", time: profileObj.time || "12:00", place: profileObj.place || "", lat: profileObj.lat || "", lon: profileObj.lon || "", utcOffset: profileObj.utcOffset || "5.5", gotra: profileObj.gotra || "", jaati: profileObj.jaati || "", kulDevta: profileObj.kulDevta || "", gramDevta: profileObj.gramDevta || "", sthanDevta: profileObj.sthanDevta || "", sunOverride: profileObj.sunOverride || "", moonOverride: profileObj.moonOverride || "", ascOverride: profileObj.ascOverride || "", associatedProfileId: profileObj.associatedProfileId || "", associatedRelation: profileObj.associatedRelation || "" }); setEd(profileObj); };
      const hSave = async (e) => { e.preventDefault(); const pD = { ...formData, lat: parseFloat(formData.lat) || 0, lon: parseFloat(formData.lon) || 0, utcOffset: parseFloat(formData.utcOffset) || 5.5, id: formData.id || Date.now().toString() }; const nP = formData.id ? prs.map((p) => (p.id === pD.id ? pD : p)) : [...prs, pD]; const vaultFile = await AppDB.getFile(`gl_vault_${u.emailHash}.json`); vaultFile.content.profiles = await CryptoUtils.encrypt(nP); vaultFile.content.settings = vaultFile.content.settings || await CryptoUtils.encrypt(set); await AppDB.saveFile(`gl_vault_${u.emailHash}.json`, vaultFile.content, vaultFile.sha); setU({ ...u, profiles: nP }); setActiveProfileId(pD.id); setEd(null); };
      const deleteProfile = async (profileId) => { const nP = prs.filter((p) => p.id !== profileId); const vaultFile = await AppDB.getFile(`gl_vault_${u.emailHash}.json`); vaultFile.content.profiles = await CryptoUtils.encrypt(nP); await AppDB.saveFile(`gl_vault_${u.emailHash}.json`, vaultFile.content, vaultFile.sha); setU({ ...u, profiles: nP }); setActiveProfileId(nP[0]?.id || null); setEd(null); };
      const updateSettings = async (ns) => { setU((current) => ({ ...current, settings: ns })); settingsSaveChain.current = settingsSaveChain.current.catch(() => {}).then(async () => { const vaultFile = await AppDB.getFile(`gl_vault_${u.emailHash}.json`); vaultFile.content.settings = await CryptoUtils.encrypt(ns); await AppDB.saveFile(`gl_vault_${u.emailHash}.json`, vaultFile.content, vaultFile.sha); }); return settingsSaveChain.current; };

      if (!dbC) return <SetupModal onConfig={() => setDbC(true)} />;
      if (!u) return <AuthModal onLogin={(d) => { setU(d); if (d?.profiles?.length) setActiveProfileId(d.profiles[0].id); }} />;
      if (u?.requiresPasswordChange) return <ForcePasswordChange email={u.email} emailHash={u.emailHash} onComplete={() => setU({ ...u, requiresPasswordChange: false })} />;

      const calculateTimezone = (lat, lon) => { if (lat >= 22.5 && lat <= 26.5 && lon >= 51.0 && lon <= 56.5) return "4.0"; if (lat >= 6.0 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5) return "5.5"; if (lat >= 49.5 && lat <= 61.0 && lon >= -8.0 && lon <= 2.0) return "0.0"; return (Math.round((lon / 15) * 2) / 2).toFixed(1); };
      
      const fetchCityCoordinates = async () => { 
        const query = formData.place; 
        if (!query) return alert("Please type a city name first."); 
        const preset = window.CITY_PRESETS?.find((c) => c.name.toLowerCase().includes(query.toLowerCase())); 
        if (preset) { setFormData((prev) => ({ ...prev, place: preset.name, lat: preset.lat.toString(), lon: preset.lon.toString(), utcOffset: preset.utc.toString() })); return; } 
        try { 
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`); 
            const data = await res.json(); 
            if (data && data.length > 0) { 
                const lat = parseFloat(data[0].lat); const lon = parseFloat(data[0].lon); 
                let tz = calculateTimezone(lat, lon);
                try {
                    const timeRes = await fetch(`https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`);
                    if(timeRes.ok) {
                        const tData = await timeRes.json();
                        if(tData.currentUtcOffset && tData.currentUtcOffset.seconds !== undefined) { tz = (tData.currentUtcOffset.seconds / 3600).toFixed(1); }
                    }
                } catch(err) {}
                setFormData((prev) => ({ ...prev, place: data[0].display_name.split(",")[0], lat: lat.toFixed(4), lon: lon.toFixed(4), utcOffset: tz })); 
            } else { alert("City coordinates not found. Enter latitude and longitude manually."); } 
        } catch (e) { alert("Network search failed. Enter coordinates manually."); } 
      };

      const handleGPS = () => { if (!navigator.geolocation) return alert("Geolocation not supported on this browser."); navigator.geolocation.getCurrentPosition( async (pos) => { const lat = pos.coords.latitude; const lon = pos.coords.longitude; const tz = calculateTimezone(lat, lon); let placeName = "GPS Location"; try { const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`); const d = await r.json(); placeName = d.address?.city || d.address?.town || d.address?.county || "Current Location"; } catch (e) {} setFormData((prev) => ({ ...prev, place: placeName, lat: lat.toFixed(4), lon: lon.toFixed(4), utcOffset: tz })); }, () => alert("GPS access denied.") ); };

      return (
        <div className="min-h-screen w-full font-sans pb-12 bg-[#09090b] text-slate-200 relative">
          <datalist id="gotras">{window.GOTRAS?.map((g) => (<option className="bg-[#09090b] text-white" key={g} value={g} />))}</datalist>
          <datalist id="jaatis">{window.JAATIS?.map((j) => (<option className="bg-[#09090b] text-white" key={g} value={j} />))}</datalist>

          {ss && <SettingsModal u={u} settings={set} onClose={() => setSs(false)} onUpdateSettings={updateSettings} onMfaSuccess={() => setU({ ...u, mfaEnabled: true })} />}
          {adminAuthOpen && <AdminAuthModal u={u} onClose={() => setAdminAuthOpen(false)} onAuthenticated={() => { setAdminAuthOpen(false); setAdminConsoleOpen(true); }} />}
          {adminConsoleOpen && <AdminConsoleModal onClose={() => setAdminConsoleOpen(false)} onResetDb={() => { AppDB.clearConfig(); setAdminConsoleOpen(false); setDbC(false); setU(null); try { localStorage.removeItem("gl_active_user"); } catch (e) {} }} />}

          {/* Bento Header */}
          <div className="sticky top-0 z-30 p-4 pb-0 max-w-5xl mx-auto">
            <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-4 sm:p-5 shadow-2xl flex justify-between items-center transition hover:border-[#3f3f46]">
              <div className="flex items-center gap-4">
                <SageLogo size={42} />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-white tracking-tight">Graha Ledger V3</h1>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-mono rounded uppercase border border-green-500/20">Synced</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {u.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div id="google_translate_element" className="mr-3 scale-75 md:scale-90 origin-right"></div>
                {prs.length > 1 && (
                  <select
                    value={aP?.id || ""}
                    onChange={(e) => setActiveProfileId(e.target.value)}
                    className="bg-[#09090b] border border-[#27272a] text-slate-200 rounded-xl px-3 py-2 text-xs font-mono outline-none max-w-[120px] sm:max-w-[160px] truncate hover:border-[#3f3f46] transition"
                  >
                    {prs.map((p) => (<option className="bg-[#09090b] text-white" key={p.id} value={p.id}>{p.name.split(" ")[0]}</option>))}
                  </select>
                )}
                <button onClick={() => handleOpenEdit({})} title="New Profile" className="p-2.5 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-indigo-400 hover:text-white"><Icon name="user-plus" size={18} /></button>
                <button onClick={() => setSs(true)} title="Settings" className="p-2.5 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-slate-300 hover:text-white"><Icon name="gear" size={18} /></button>
                <button onClick={() => setAdminAuthOpen(true)} title="Admin Settings" className="p-2.5 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-blue-400 hover:text-white"><Icon name="shield-check" size={18} /></button>
                <button onClick={logoutUser} title="Sign Out" className="p-2.5 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-red-500/20 hover:border-red-500/30 transition text-red-400"><Icon name="sign-out" size={18} /></button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-4 py-5 relative z-10">
            {prs.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-[#27272a] rounded-3xl mt-8 bg-[#18181b] gl-fadein">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon name="sparkle" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Welcome to Graha Ledger</h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">Initialize your encrypted Vedic vault by creating your first natal horoscope profile.</p>
                <button onClick={() => handleOpenEdit({})} className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition shadow-lg shadow-white/10">Create Natal Profile</button>
              </div>
            ) : (
              <TabOrchestrator pr={aP} ch={chs[aP?.id]} date={dt} setDate={setDt} settings={set} onEditProfile={handleOpenEdit} prs={prs} chs={chs} u={u} setU={setU} updateSettings={updateSettings} />
            )}

            {ed && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setEd(null)}>
                <form onClick={(e) => e.stopPropagation()} onSubmit={hSave} className="w-full max-w-md bg-[#18181b] rounded-3xl border border-[#27272a] p-6 space-y-4 max-h-[90vh] overflow-y-auto gl-fadein shadow-2xl relative custom-scrollbar">
                  <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
                    <h3 className="text-base font-bold text-white tracking-tight">{formData.id ? "Modify Profile" : "Create Natal Profile"}</h3>
                    {formData.id && ( <button type="button" onClick={() => { if(confirm("Delete this profile?")){ deleteProfile(formData.id); } }} className="text-[10px] text-red-400 font-mono border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-lg hover:bg-red-500/20 transition">Delete</button> )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Full Name</label>
                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Date of Birth</label>
                      <input required type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 block">Time (24h)</label>
                      <input required type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1 flex justify-between items-center">
                      <span>Birth Place</span>
                      <button type="button" onClick={handleGPS} className="text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded-lg text-[10px] font-mono flex items-center gap-1">Use GPS <Icon name="crosshair" /></button>
                    </label>
                    <div className="flex gap-2">
                      <input required value={formData.place} onChange={(e) => setFormData({ ...formData, place: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); fetchCityCoordinates(); } }} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition" placeholder="Type city name..." />
                      <button type="button" onClick={fetchCityCoordinates} className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition shrink-0">Auto-Fetch</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Latitude</label><input required type="number" step="any" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                    <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Longitude</label><input required type="number" step="any" value={formData.lon} onChange={(e) => setFormData({ ...formData, lon: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                    <div><label className="text-[9px] text-indigo-400 uppercase font-mono mb-1 block font-bold">UTC Offset</label><input required type="number" step="any" value={formData.utcOffset} onChange={(e) => setFormData({ ...formData, utcOffset: e.target.value })} className="w-full bg-[#09090b] border border-indigo-500/40 rounded-xl px-2.5 py-2 text-xs outline-none text-indigo-300 font-bold" /></div>
                  </div>
                  
                  <div className="pt-3 border-t border-[#27272a]">
                    <div className="text-[10px] text-amber-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">Astrological Overrides</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Sun Sign</label><input placeholder="Auto" value={formData.sunOverride || ''} onChange={(e) => setFormData({ ...formData, sunOverride: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Moon Sign</label><input placeholder="Auto" value={formData.moonOverride || ''} onChange={(e) => setFormData({ ...formData, moonOverride: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Ascendant</label><input placeholder="Auto" value={formData.ascOverride || ''} onChange={(e) => setFormData({ ...formData, ascOverride: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white" /></div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#27272a]">
                    <div className="text-[10px] text-emerald-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">Profile Association</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Related Profile</label>
                        <select value={formData.associatedProfileId || ''} onChange={(e) => setFormData({ ...formData, associatedProfileId: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white appearance-none">
                          <option value="">None</option>
                          {prs.filter(p => p.id !== formData.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Relationship</label>
                        <select value={formData.associatedRelation || ''} onChange={(e) => setFormData({ ...formData, associatedRelation: e.target.value })} className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white appearance-none">
                          <option value="">Select...</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Partner">Partner</option>
                          <option value="Parent">Parent</option>
                          <option value="Child">Child</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Friend">Friend</option>
                          <option value="Colleague">Colleague</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#27272a]">
                    <div className="text-[10px] text-indigo-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">Spiritual Lineage (Sankalp)</div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Gotra</label><input list="gotras" value={formData.gotra} onChange={(e) => setFormData({ ...formData, gotra: e.target.value })} placeholder="e.g. Kashyapa" className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white" /></div>
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Jaati / Varg</label><input list="jaatis" value={formData.jaati} onChange={(e) => setFormData({ ...formData, jaati: e.target.value })} placeholder="e.g. Brahmin" className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Kul Devta</label><input value={formData.kulDevta} onChange={(e) => setFormData({ ...formData, kulDevta: e.target.value })} placeholder="e.g. Chamunda" className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white" /></div>
                      <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Gram Devta</label><input value={formData.gramDevta} onChange={(e) => setFormData({ ...formData, gramDevta: e.target.value })} placeholder="e.g. Bhairava" className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white" /></div>
                    </div>
                    <div><label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Sthan Devta</label><input value={formData.sthanDevta} onChange={(e) => setFormData({ ...formData, sthanDevta: e.target.value })} placeholder="e.g. Hanumanji" className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white" /></div>
                  </div>
                  <button type="submit" className="w-full bg-white text-black font-bold rounded-xl py-3 mt-4 hover:bg-slate-200 transition shadow-lg shadow-white/10">Save Encrypted Vault Profile</button>
                </form>
              </div>
            )}
          </div>
          {aP && chs[aP.id] && <GhostPDFReport emHash={u.emailHash} profile={aP} ch={chs[aP.id]} bioScores={window.bio ? window.bio(aP.dob, dt, aP.utcOffset) : {p:0,e:0,i:0}} date={dt} prs={prs} chs={chs} />}
        </div>
      );
    }
    const rootEl = document.getElementById("root");
    if (rootEl && window.ReactDOM && window.ReactDOM.createRoot) {
      const root = window.ReactDOM.createRoot(rootEl);
      root.render(<ErrorBoundary><AppContent /></ErrorBoundary>);
    }
  }
}, 50);
