import React, { useState, useEffect, useMemo, useRef } from 'react';
import './init';

// Import all sub-components and tabs so they are bundled natively by Vite
import './jsx/components.jsx';
import './jsx/modals.jsx';
import './jsx/charts.jsx';
import './jsx/pdf-report.jsx';
import './jsx/tab-person.jsx';
import './jsx/tab-panchang.jsx';
import './jsx/tab-union.jsx';
import './jsx/tab-palmistry.jsx';
import './jsx/tab-tarot.jsx';
import './jsx/tab-ask.jsx';
import './jsx/tab-reports.jsx';
import './jsx/tab-week.jsx';
import './jsx/tab-month.jsx';
import './jsx/tabs.jsx';
import { AmbientBackground } from './jsx/ambient';

// Default seed profiles so the application is immediately interactive and functional
const SEED_PROFILES = [
  {
    id: "prof_aarav_sharma",
    name: "Aarav Sharma",
    dob: "1994-11-15",
    time: "06:30",
    place: "New Delhi, India",
    lat: 28.6139,
    lon: 77.2090,
    utcOffset: 5.5,
    gotra: "Kashyapa",
    jaati: "Brahmin",
    kulDevta: "Bhairava",
    gramDevta: "Hanumanji",
    sthanDevta: "Shiva"
  },
  {
    id: "prof_priya_patel",
    name: "Priya Patel",
    dob: "1996-04-22",
    time: "14:15",
    place: "Mumbai, India",
    lat: 19.0760,
    lon: 72.8777,
    utcOffset: 5.5,
    gotra: "Bharadwaja",
    jaati: "Vaishya",
    kulDevta: "Amba Mata",
    gramDevta: "Ganesha",
    sthanDevta: "Vishnu"
  }
];

export default function App() {
  // Hide the HTML bootloader as soon as the React App renders
  
  useEffect(() => {
    const bootloader = document.getElementById("bootloader");
    if (bootloader) {
      bootloader.style.display = "none";
    }
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,ur,sa,hi,fr,de,ja,ru,es,zh-CN',
            
          }, 'google_translate_element');
        }
      };
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);


  const [dbConfigured, setDbConfigured] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = (window as any).AppDB ? await (window as any).AppDB.loadConfig() : true;
        setDbConfigured(res);
      } catch (e) {
        setDbConfigured(true);
      }
    })();
  }, []);

  const [user, setUser] = useState<any>(() => {
    try {
      const sess = localStorage.getItem("gl_active_user");
      if (sess) {
        return JSON.parse(sess);
      }
    } catch (e) {}
    return null;
  });

  const [date, setDate] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>("prof_aarav_sharma");
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);
  const [adminConsoleOpen, setAdminConsoleOpen] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTabId, setActiveTabId] = useState("person");

  useEffect(() => {
    const handleTabChange = (e: any) => setActiveTabId(e.detail);
    
    const handleTokenUsage = (e: any) => {
      const { engine, tokens } = e.detail;
      setUser((prev: any) => {
        if (!prev) return prev;
        const newSettings = { ...prev.settings };
        if (!newSettings.tokenUsage) newSettings.tokenUsage = {};
        newSettings.tokenUsage[engine] = (newSettings.tokenUsage[engine] || 0) + tokens;
        const newUser = { ...prev, settings: newSettings };
        localStorage.setItem("gl_active_user", JSON.stringify(newUser));
        return newUser;
      });
    };
    
    window.addEventListener('tabChanged', handleTabChange);
    window.addEventListener('aiTokenUsage', handleTokenUsage);
    
    return () => {
      window.removeEventListener('tabChanged', handleTabChange);
      window.removeEventListener('aiTokenUsage', handleTokenUsage);
    };
  }, []);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    dob: "1995-01-01",
    time: "12:00",
    place: "New Delhi, India",
    lat: "28.6139",
    lon: "77.2090",
    utcOffset: "5.5",
    gotra: "Kashyapa",
    jaati: "Brahmin",
    kulDevta: "",
    gramDevta: "",
    sthanDevta: ""
  });

  const settingsSaveChain = useRef<Promise<any>>(Promise.resolve());

  // Load vault profiles if an encrypted session exists in localStorage or DB
  useEffect(() => {
    const fetchVaultIfConfigured = async () => {
      const AppDB = (window as any).AppDB;
      const CryptoUtils = (window as any).CryptoUtils;
      if (AppDB) {
        try {
          const sess = localStorage.getItem("gl_active_user");
          if (sess) {
            const pS = JSON.parse(sess);
            if (pS.emailHash && pS.emailHash !== "guest_vault_default") {
              const vaultFile = await AppDB.getFile(`gl_vault_${pS.emailHash}.json`);
              let pr = [];
              try {
                const decodedProfiles = typeof vaultFile.content.profiles === "string" ? await CryptoUtils.decrypt(vaultFile.content.profiles) : vaultFile.content.profiles;
                pr = typeof decodedProfiles === "string" ? JSON.parse(decodedProfiles) : decodedProfiles || [];
              } catch (e) {}
              let se = {};
              try {
                const decodedSettings = typeof vaultFile.content.settings === "string" ? await CryptoUtils.decrypt(vaultFile.content.settings) : vaultFile.content.settings;
                se = typeof decodedSettings === "string" ? JSON.parse(decodedSettings) : decodedSettings || {};
              } catch (e) {}
              
              const activeProfiles = pr && pr.length ? pr : SEED_PROFILES;
              setUser({
                email: pS.email,
                emailHash: pS.emailHash,
                profiles: activeProfiles,
                settings: {
                  aiModel: "auto",
                  monthSystem: "amanta",
                  kundaliStyle: "north",
                  apiKeys: {},
                  ...se
                },
                mfaEnabled: pS.mfaEnabled
              });
              if (activeProfiles.length) setActiveProfileId(activeProfiles[0].id);
            }
          }
        } catch (e) {}
      }
    };
    fetchVaultIfConfigured();
  }, [dbConfigured]);

  const profiles: any[] = useMemo(() => {
    if (Array.isArray(user?.profiles) && user.profiles.length > 0) {
      return user.profiles;
    }
    return SEED_PROFILES;
  }, [user?.profiles]);

  const settings = user?.settings || { aiModel: "auto", monthSystem: "amanta", kundaliStyle: "north", apiKeys: {} };

  // Calculate planetary kundali and ephemeris for all profiles
  const charts = useMemo(() => {
    const o: Record<string, any> = {};
    if (Array.isArray(profiles)) {
      profiles.forEach((p) => {
        if (p && p.id && (window as any).computeKundli) {
          try {
            o[p.id] = (window as any).computeKundli(p, date);
          } catch (err) {
            console.error("Error computing Kundli for", p.name, err);
          }
        }
      });
    }
    return o;
  }, [profiles, date]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || (profiles.length > 0 ? profiles[0] : null);

  // PDF Report Handler
  useEffect(() => {
    const handlePdf = async () => {
      const el = document.getElementById('pdf-render-target');
      if (!el) return;

      el.classList.remove('hidden');

      const loader = document.createElement('div');
      loader.id = 'pdf-loader-overlay';
      loader.innerHTML = `
        <div style="position:fixed;inset:0;z-index:99999;background:rgba(9,9,11,0.92);backdrop-filter:blur(8px);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#818cf8;font-family:monospace;font-size:13px;">
          <div style="width:44px;height:44px;border:3px solid #818cf8;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:16px;"></div>
          <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
          Compiling High-Resolution Astro-Dossier...
        </div>
      `;
      document.body.appendChild(loader);

      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        const PDFValidator = (window as any).PDFValidator;
        if (PDFValidator) {
          const validation = await PDFValidator.validate(el);
          if (!validation.valid) {
            alert(`PDF layout validation notice:\n\n${PDFValidator.formatIssues(validation)}`);
          }
        }

        const jspdf = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;

        if (jspdf && html2canvas) {
          const pdf = new jspdf.jsPDF('p', 'pt', 'a4');
          const pages = el.querySelectorAll('.pdf-page');

          for (let i = 0; i < pages.length; i++) {
            const pageEl = pages[i] as HTMLElement;
            const captureWidth = Math.max(pageEl.clientWidth, pageEl.scrollWidth) || 794;
            const captureHeight = Math.max(pageEl.clientHeight, pageEl.scrollHeight) || 1123;
            const canvas = await html2canvas(pageEl, {
              scale: 2,
              width: captureWidth,
              height: captureHeight,
              windowWidth: captureWidth,
              windowHeight: captureHeight,
              useCORS: true,
              backgroundColor: '#09090b',
              logging: false
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
          }

          pdf.save(`${activeProfile?.name ? activeProfile.name.replace(/\s+/g, '_') : 'Vedic'}_AstroDossier.pdf`);
        }
      } catch (err) {
        console.error("PDF generation error:", err);
      } finally {
        const overlay = document.getElementById('pdf-loader-overlay');
        if (overlay) overlay.remove();
        el.classList.add('hidden');
      }
    };

    window.addEventListener('generate-pdf', handlePdf);
    return () => window.removeEventListener('generate-pdf', handlePdf);
  }, [activeProfile]);

  const logoutUser = () => {
    try {
      localStorage.removeItem("gl_active_user");
    } catch (e) {}
    setUser(null);
  };

  const handleOpenEdit = (profileObj: any = {}) => {
    setFormData({
      id: profileObj.id || "",
      name: profileObj.name || "",
      dob: profileObj.dob || "1995-01-01",
      time: profileObj.time || "12:00",
      place: profileObj.place || "New Delhi, India",
      lat: (profileObj.lat ?? "28.6139").toString(),
      lon: (profileObj.lon ?? "77.2090").toString(),
      utcOffset: (profileObj.utcOffset ?? "5.5").toString(),
      gotra: profileObj.gotra || "",
      jaati: profileObj.jaati || "",
      kulDevta: profileObj.kulDevta || "",
      gramDevta: profileObj.gramDevta || "",
      sthanDevta: profileObj.sthanDevta || ""
    });
    setEditingProfile(profileObj);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const pD = {
      ...formData,
      lat: parseFloat(formData.lat) || 0,
      lon: parseFloat(formData.lon) || 0,
      utcOffset: parseFloat(formData.utcOffset) || 5.5,
      id: formData.id || "prof_" + Date.now().toString()
    };

    const newProfiles = formData.id
      ? profiles.map((p) => (p.id === pD.id ? pD : p))
      : [...profiles, pD];

    const AppDB = (window as any).AppDB;
    const CryptoUtils = (window as any).CryptoUtils;

    if (AppDB && CryptoUtils && user.emailHash && user.emailHash !== "guest_vault_default") {
      try {
        const vaultFile = await AppDB.getFile(`gl_vault_${user.emailHash}.json`);
        vaultFile.content.profiles = await CryptoUtils.encrypt(newProfiles);
        vaultFile.content.settings = vaultFile.content.settings || await CryptoUtils.encrypt(settings);
        await AppDB.saveFile(`gl_vault_${user.emailHash}.json`, vaultFile.content, vaultFile.sha);
      } catch (err) {}
    }

    setUser({ ...user, profiles: newProfiles });
    setActiveProfileId(pD.id);
    setEditingProfile(null);
  };

  const handleDeleteProfile = async (profileId: string) => {
    const newProfiles = profiles.filter((p) => p.id !== profileId);
    const AppDB = (window as any).AppDB;
    const CryptoUtils = (window as any).CryptoUtils;

    if (AppDB && CryptoUtils && user.emailHash && user.emailHash !== "guest_vault_default") {
      try {
        const vaultFile = await AppDB.getFile(`gl_vault_${user.emailHash}.json`);
        vaultFile.content.profiles = await CryptoUtils.encrypt(newProfiles);
        await AppDB.saveFile(`gl_vault_${user.emailHash}.json`, vaultFile.content, vaultFile.sha);
      } catch (err) {}
    }

    setUser({ ...user, profiles: newProfiles });
    setActiveProfileId(newProfiles[0]?.id || "");
    setEditingProfile(null);
  };

  const updateSettings = async (ns: any) => {
    setUser((current: any) => ({ ...current, settings: ns }));
    const AppDB = (window as any).AppDB;
    const CryptoUtils = (window as any).CryptoUtils;

    if (AppDB && CryptoUtils && user.emailHash && user.emailHash !== "guest_vault_default") {
      settingsSaveChain.current = settingsSaveChain.current.catch(() => {}).then(async () => {
        try {
          const vaultFile = await AppDB.getFile(`gl_vault_${user.emailHash}.json`);
          vaultFile.content.settings = await CryptoUtils.encrypt(ns);
          await AppDB.saveFile(`gl_vault_${user.emailHash}.json`, vaultFile.content, vaultFile.sha);
        } catch (err) {}
      });
    }
    return settingsSaveChain.current;
  };

  const calculateTimezone = (lat: number, lon: number) => {
    if (lat >= 22.5 && lat <= 26.5 && lon >= 51.0 && lon <= 56.5) return "4.0";
    if (lat >= 6.0 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5) return "5.5";
    if (lat >= 49.5 && lat <= 61.0 && lon >= -8.0 && lon <= 2.0) return "0.0";
    return (Math.round((lon / 15) * 2) / 2).toFixed(1);
  };

  const fetchCityCoordinates = async () => {
    const query = formData.place;
    if (!query) return alert("Please enter a city name first.");
    const presets = (window as any).CITY_PRESETS || [];
    const preset = presets.find((c: any) => c.name.toLowerCase().includes(query.toLowerCase()));
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        place: preset.name,
        lat: preset.lat.toString(),
        lon: preset.lon.toString(),
        utcOffset: preset.utc.toString()
      }));
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        let tz = calculateTimezone(lat, lon);
        setFormData((prev) => ({
          ...prev,
          place: data[0].display_name.split(",")[0],
          lat: lat.toFixed(4),
          lon: lon.toFixed(4),
          utcOffset: tz
        }));
      } else {
        alert("City not found. Please enter latitude and longitude manually.");
      }
    } catch (e) {
      alert("City lookup error. Please specify coordinates manually.");
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const tz = calculateTimezone(lat, lon);
        setFormData((prev) => ({
          ...prev,
          place: "Current GPS Location",
          lat: lat.toFixed(4),
          lon: lon.toFixed(4),
          utcOffset: tz
        }));
      },
      () => alert("GPS access denied.")
    );
  };

  const SageLogo = (window as any).SageLogo || (() => <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white">GL</div>);
  const Icon = (window as any).Icon || (({ name }: any) => <span>•</span>);
  const TabOrchestrator = (window as any).TabOrchestrator;
  const SettingsModal = (window as any).SettingsModal;
  const SetupModal = (window as any).SetupModal;
  const AuthModal = (window as any).AuthModal;
  const AdminAuthModal = (window as any).AdminAuthModal;
  const AdminConsoleModal = (window as any).AdminConsoleModal;
  const GhostPDFReport = (window as any).GhostPDFReport;

  const activeChart = activeProfile ? charts[activeProfile.id] : null;

  const bgImages: Record<string, string> = {
    person: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
    reports: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    panchang: "https://images.unsplash.com/photo-1550503028-2b0e6df29fdb?q=80&w=1920&auto=format&fit=crop", // Sunset sky
    union: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1920&auto=format&fit=crop",
    palmistry: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=1920&auto=format&fit=crop",
    tarot: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=1920&auto=format&fit=crop", // Nebula / deep purple
    week: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1920&auto=format&fit=crop",
    month: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop",
    ask: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1920&auto=format&fit=crop" // Mystic AI / purple energy
  };

  const themeMap: Record<string, string> = {
    person: "from-indigo-950/20 via-black to-slate-950/10",
    reports: "from-blue-950/20 via-black to-cyan-950/10",
    panchang: "from-amber-950/40 via-orange-950/20 to-rose-950/30",
    union: "from-pink-950/20 via-black to-rose-950/10",
    palmistry: "from-violet-950/20 via-black to-purple-950/10",
    tarot: "from-purple-950/40 via-fuchsia-950/20 to-indigo-950/40",
    week: "from-indigo-950/20 via-black to-blue-950/10",
    month: "from-slate-900/30 via-black to-slate-950",
    ask: "from-fuchsia-950/40 via-purple-950/20 to-violet-950/40"
  };

  const activeTheme = themeMap[activeTabId] || "from-black via-black to-black";

  if (!user) {
    const AuthModal = (window as any).AuthModal;
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-black text-slate-200 relative p-6">
        <div className="fixed inset-0 -z-30 bg-[#09090b]"></div>
        <div className="fixed inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        
        <div className="text-center bg-black/60 backdrop-blur-xl p-10 rounded-3xl border border-[#27272a] shadow-2xl max-w-lg w-full z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-900 to-black border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor" className="text-indigo-400">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,128Z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Graha Ledger</h1>
          <p className="text-sm text-indigo-200/70 font-mono uppercase tracking-widest mb-8">Vedic Jyotish & Biorhythm</p>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            The Astrological Synthesis Engine. Connect your Cloud Vault to access predictive horoscopes, offline biorhythms, and personalized Vedic insights.
          </p>
          
          <button 
            onClick={() => setShowAuthModal(true)} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl transition font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            Sign In / Create Vault
          </button>
        </div>

        {showAuthModal && AuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 text-sm font-mono tracking-widest uppercase">✕ Close</button>
            <AuthModal onLogin={(d: any) => { setUser(d); setShowAuthModal(false); if (d?.profiles?.length) setActiveProfileId(d.profiles[0].id); }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-sans pb-16 bg-transparent text-slate-200 selection:bg-indigo-500 selection:text-white relative">
      <div className="fixed inset-0 -z-30 bg-black"></div>
      {/* Background Images for Preloading to avoid flicker */}
      {Object.entries(bgImages).map(([key, url]) => (
        <div 
          key={key}
          className={`fixed inset-0 -z-20 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat ${activeTabId === key ? 'opacity-40' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${url})` }}
        ></div>
      ))}
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 ${activeTheme} opacity-90`}></div>
      <AmbientBackground activeTabId={activeTabId} />

      <datalist id="gotras">{(window as any).GOTRAS?.map((g: string) => (<option key={g} value={g} />))}</datalist>
      <datalist id="jaatis">{(window as any).JAATIS?.map((j: string) => (<option key={j} value={j} />))}</datalist>

      {showSettings && SettingsModal && (
        <SettingsModal
          u={user}
          settings={settings}
          onClose={() => setShowSettings(false)}
          onUpdateSettings={updateSettings}
          onMfaSuccess={() => setUser({ ...user, mfaEnabled: true })}
        />
      )}

      {showSetupModal && SetupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button onClick={() => setShowSetupModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 text-sm">✕ Close</button>
            <SetupModal onConfig={() => { setDbConfigured(true); setShowSetupModal(false); }} />
          </div>
        </div>
      )}

      {showAuthModal && AuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white z-50 text-sm">✕ Close</button>
            <AuthModal onLogin={(d: any) => { setUser(d); setShowAuthModal(false); if (d?.profiles?.length) setActiveProfileId(d.profiles[0].id); }} />
          </div>
        </div>
      )}

      {adminAuthOpen && AdminAuthModal && (
        <AdminAuthModal
          u={user}
          onClose={() => setAdminAuthOpen(false)}
          onAuthenticated={() => { setAdminAuthOpen(false); setAdminConsoleOpen(true); }}
        />
      )}

      {adminConsoleOpen && AdminConsoleModal && (
        <AdminConsoleModal
          onClose={() => setAdminConsoleOpen(false)}
          onResetDb={() => {
            (window as any).AppDB?.clearConfig();
            setAdminConsoleOpen(false);
            setDbConfigured(false);
            setUser(null);
          }}
        />
      )}

      {/* Bento Header */}
      <header className="sticky top-0 z-30 p-4 pb-0 max-w-6xl mx-auto">
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-3.5 sm:p-4 shadow-2xl flex flex-wrap justify-between items-center gap-3 transition hover:border-[#3f3f46]">
          <div className="flex items-center gap-3.5">
            <SageLogo size={38} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Graha Ledger</h1>
                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono rounded uppercase border border-indigo-500/20 font-semibold">
                  Vedic Jyotish & Biorhythm
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {user.email || "Active Engine"}
              </p>
            </div>
          </div>

          
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#09090b] border border-[#27272a] rounded-xl px-2 py-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-slate-400 absolute left-2 pointer-events-none"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM41.37,136H94.12a321.43,321.43,0,0,0,4.8,56.28A88.13,88.13,0,0,1,41.37,136ZM128,215.89a263.26,263.26,0,0,1-12.87-23.61c-3.13-6.62-5.75-13.88-7.81-20.28h41.36c-2.06,6.4-4.68,13.66-7.81,20.28A263.26,263.26,0,0,1,128,215.89ZM101.44,152A305.21,305.21,0,0,1,96.2,128a305.21,305.21,0,0,1,5.24-24h53.12a305.21,305.21,0,0,1,5.24,24,305.21,305.21,0,0,1-5.24,24Zm55.64,40.28a321.43,321.43,0,0,0,4.8-56.28h52.75A88.13,88.13,0,0,1,157.08,192.28ZM214.63,120H161.88a321.43,321.43,0,0,0-4.8-56.28A88.13,88.13,0,0,1,214.63,120ZM98.92,63.72a321.43,321.43,0,0,0-4.8,56.28H41.37A88.13,88.13,0,0,1,98.92,63.72ZM128,40.11a263.26,263.26,0,0,1,12.87,23.61c3.13,6.62,5.75,13.88,7.81,20.28H115.32c2.06-6.4,4.68-13.66,7.81-20.28A263.26,263.26,0,0,1,128,40.11Z"></path></svg>
              <div id="google_translate_element" className="shrink-0 overflow-hidden [&_.goog-te-combo]:pl-6" style={{ minWidth: '100px' }}></div>
            </div>

            {profiles.length > 0 && (
              <div className="flex items-center gap-1.5 bg-[#09090b] border border-[#27272a] rounded-xl px-2 py-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Profile:</span>
                <select
                  value={activeProfile?.id || ""}
                  onChange={(e) => setActiveProfileId(e.target.value)}
                  className="bg-transparent text-white font-medium text-xs font-mono outline-none max-w-[130px] sm:max-w-[180px] truncate cursor-pointer"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#18181b] text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => handleOpenEdit({})}
              title="Add New Astrological Profile"
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-indigo-400 hover:text-white text-xs font-mono"
            >
              <Icon name="user-plus" size={15} />
              <span className="hidden sm:inline">Add Profile</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              title="Astrological Engine Settings"
              className="p-2 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-slate-300 hover:text-white"
            >
              <Icon name="gear" size={16} />
            </button>

            <button
              onClick={() => setShowAuthModal(true)}
              title="Cloud Sync / Auth"
              className="p-2 rounded-xl border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] transition text-slate-300 hover:text-white"
            >
              <Icon name="shield-check" size={16} />
            </button>

            {user && (
              <button
                onClick={logoutUser}
                title="Sign Out"
                className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition text-red-400"
              >
                <Icon name="sign-out" size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Tab View */}
      <main className="mx-auto max-w-6xl px-4 py-5 relative z-10">
        {activeProfile && TabOrchestrator ? (
          <TabOrchestrator
            pr={activeProfile}
            ch={activeChart}
            date={date}
            setDate={setDate}
            settings={settings}
            onEditProfile={handleOpenEdit}
            prs={profiles}
            chs={charts}
            u={user}
            setU={setUser}
            updateSettings={updateSettings}
          />
        ) : (
          <div className="p-8 text-center text-slate-400 bg-[#18181b] rounded-3xl border border-[#27272a]">
            Loading Astral Ephemeris Engine...
          </div>
        )}

        {/* Modal: Edit or Create Profile */}
        {editingProfile && (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setEditingProfile(null)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSaveProfile}
              className="w-full max-w-md bg-[#18181b] rounded-3xl border border-[#27272a] p-6 space-y-4 max-h-[90vh] overflow-y-auto gl-fadein shadow-2xl relative custom-scrollbar"
            >
              <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {formData.id ? "Modify Astrological Profile" : "Create New Natal Profile"}
                </h3>
                {formData.id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Delete this profile from your vault?")) {
                        handleDeleteProfile(formData.id);
                      }
                    }}
                    className="text-[11px] text-red-400 font-mono border border-red-500/30 bg-red-500/10 px-2.5 py-1 rounded-lg hover:bg-red-500/20 transition"
                  >
                    Delete
                  </button>
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">Full Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">Date of Birth</label>
                  <input
                    required
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">Time (24h)</label>
                  <input
                    required
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex justify-between items-center">
                  <span>Birth Location</span>
                  <button
                    type="button"
                    onClick={handleGPS}
                    className="text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded-lg text-[10px] font-mono flex items-center gap-1"
                  >
                    Use GPS <Icon name="crosshair" />
                  </button>
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        fetchCityCoordinates();
                      }
                    }}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-3 py-2 text-sm outline-none text-white focus:border-indigo-500 transition"
                    placeholder="Type city name..."
                  />
                  <button
                    type="button"
                    onClick={fetchCityCoordinates}
                    className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition shrink-0"
                  >
                    Auto-Fetch
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Latitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Longitude</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={formData.lon}
                    onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-2 text-xs outline-none text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-indigo-400 uppercase font-mono mb-1 block font-bold">UTC Offset</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={formData.utcOffset}
                    onChange={(e) => setFormData({ ...formData, utcOffset: e.target.value })}
                    className="w-full bg-[#09090b] border border-indigo-500/40 rounded-xl px-2.5 py-2 text-xs outline-none text-indigo-300 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#27272a]">
                <div className="text-[10px] text-indigo-400 uppercase font-mono mb-3 tracking-widest text-center font-bold">
                  Spiritual Lineage & Sankalp
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Gotra</label>
                    <input
                      list="gotras"
                      value={formData.gotra}
                      onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                      placeholder="e.g. Kashyapa"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Jaati / Varg</label>
                    <input
                      list="jaatis"
                      value={formData.jaati}
                      onChange={(e) => setFormData({ ...formData, jaati: e.target.value })}
                      placeholder="e.g. Brahmin"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Kul Devta</label>
                    <input
                      value={formData.kulDevta}
                      onChange={(e) => setFormData({ ...formData, kulDevta: e.target.value })}
                      placeholder="e.g. Bhairava"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Gram Devta</label>
                    <input
                      value={formData.gramDevta}
                      onChange={(e) => setFormData({ ...formData, gramDevta: e.target.value })}
                      placeholder="e.g. Hanumanji"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 uppercase font-mono mb-1 block">Sthan Devta</label>
                  <input
                    value={formData.sthanDevta}
                    onChange={(e) => setFormData({ ...formData, sthanDevta: e.target.value })}
                    placeholder="e.g. Shiva"
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs outline-none text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="flex-1 bg-[#09090b] border border-[#27272a] text-slate-300 font-bold rounded-xl py-2.5 hover:bg-[#27272a] transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white text-black font-bold rounded-xl py-2.5 hover:bg-slate-200 transition shadow-lg shadow-white/10 text-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Hidden PDF Canvas Render Target */}
      {activeProfile && activeChart && GhostPDFReport && (
        <GhostPDFReport
          profile={activeProfile}
          ch={activeChart}
          bioScores={(window as any).bio ? (window as any).bio(activeProfile.dob, date, activeProfile.utcOffset) : { p: 0, e: 0, i: 0 }}
          date={date}
          prs={profiles}
          chs={charts}
        />
      )}
    </div>
  );
}
