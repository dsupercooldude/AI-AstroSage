// src/jsx/pdf-report.jsx
var React = window.React;

window.GhostPDFReport = React.forwardRef(({ profile, ch, bioScores, date }, ref) => {
  if (!profile || !ch) return <div ref={ref} className="hidden"></div>;

  const details = window.calculatePlanetaryDetails 
    ? window.calculatePlanetaryDetails(ch.d1?.signs || {}, ch.planetaryDegrees)
    : {};
    
  const jaimini = window.calculateJaiminiKarakas 
    ? window.calculateJaiminiKarakas(ch.planetaryDegrees) 
    : {};
    
  const avasthas = window.calculateBaladiAvastha 
    ? window.calculateBaladiAvastha(ch.planetaryDegrees, ch.d1?.placements || {}) 
    : {};
    
  const weekday = window.WEEKDAY[date.getDay()];
  const gochara = window.generateDeepGochara 
    ? window.generateDeepGochara(ch, ch.d1?.lagna || "Aries", date, weekday, bioScores || { p: 0, e: 0, i: 0 }) 
    : {};
    
  const deepSynthesis = window.generateDeepSynthesis 
    ? window.generateDeepSynthesis(profile, ch, bioScores || {p:0,e:0,i:0}, date) 
    : {};
    
  const dynamicRx = deepSynthesis.dynamicPrescription || {};
  
  const currentYear = date.getFullYear() + (date.getMonth() / 12);
  const foundDashaIdx = ch.dasha?.findIndex(d => currentYear >= d.start && currentYear < d.end) ?? -1;
  const activeDashaIdx = foundDashaIdx >= 0 ? foundDashaIdx : 0;
  const displayDashas = ch.dasha?.slice(activeDashaIdx, activeDashaIdx + 4) || [];

  const yearlyForecast = window.getYearlyForecastData 
    ? window.getYearlyForecastData(profile, ch, date) 
    : [];

  const formatBio = (val) => Math.round(((val + 1) / 2) * 100);
  const [Y, M, D] = profile.dob.split("-").map(Number);
  const eD = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0) - ((profile.utcOffset || 0) * 3600000) - (Date.UTC(Y, M - 1, D, 12, 0, 0) - ((profile.utcOffset || 0) * 3600000))) / 86400000;
  
  const getWave = (cycle) => {
    let path = "";
    for(let day = -15; day <= 15; day++) {
      const x = ((day + 15) / 30) * 100;
      const y = 20 - (Math.sin((2 * Math.PI * (eD + day)) / cycle) * 20);
      path += `${day === -15 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return path;
  };

  const akPlanet = jaimini["Atma Karaka (AK)"] || "Sun";
  const amkPlanet = jaimini["Amatya Karaka (AmK)"] || "Moon";

  return (
    <div id="pdf-render-target" ref={ref} className="fixed top-0 -left-[20000px] hidden flex-col gap-10 bg-[#0b0d19] z-[-9999]">
      <style>{`
        .pdf-karakas .pdf-karaka-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .pdf-karakas .pdf-karaka-list > div { padding: 14px; gap: 8px; }
        .pdf-karakas .pdf-karaka-list > div .text-lg { font-size: 12px; }
        .pdf-karakas .pdf-karaka-list > div .text-2xl { font-size: 16px; }
        .pdf-karakas .pdf-karaka-list > div .text-sm { font-size: 10px; line-height: 1.35; }
        .pdf-avasthas .pdf-avastha-list > div { padding: 12px; gap: 6px; }
        .pdf-avasthas .pdf-avastha-list > div .text-xl { font-size: 15px; }
        .pdf-avasthas .pdf-avastha-list > div .text-base { font-size: 10px; line-height: 1.35; }
        .pdf-dasha .grid { gap: 12px; }
        .pdf-dasha .grid > div { padding: 14px; }
        .pdf-dasha .grid > div .text-xl { font-size: 15px; }
        .pdf-dasha .grid > div .text-base { font-size: 10px; }
        .pdf-gochara > div:last-child { padding: 14px; }
        .pdf-gochara > div:last-child > div { gap: 12px; }
        .pdf-gochara > div:last-child > div > div { padding: 14px; }
        .pdf-gochara > div:last-child > div > div .text-2xl { font-size: 15px; }
        .pdf-gochara > div:last-child > div > div .text-xl { font-size: 12px; }
        .pdf-gochara > div:last-child > div > div .text-base { font-size: 10px; line-height: 1.35; }
        .pdf-forecast > div:last-child { gap: 12px; }
        .pdf-forecast > div:last-child > div { padding: 14px; }
        .pdf-forecast > div:last-child > div .text-xl { font-size: 14px; }
        .pdf-forecast > div:last-child > div .text-sm { font-size: 10px; line-height: 1.3; }
      `}</style>
      
      {/* ========================================== */}
      {/* PAGE 1: EXECUTIVE SUMMARY                  */}
      {/* ========================================== */}
      <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <div className="border-b border-amber-400/30 pb-6 mb-8 text-center">
          <h1 className="font-serif text-4xl text-amber-400 mb-2">Vedic Astrological Dossier</h1>
          <h2 className="text-2xl font-bold tracking-widest uppercase">{profile.name}</h2>
          <p className="text-sm text-white/60 font-mono mt-2 bg-white/5 inline-block px-4 py-2 rounded-lg border border-white/10">
            DOB: {profile.dob} | Time: {profile.time} | Location: {profile.place} <br/> 
            Generated: {date.toLocaleDateString()}
          </p>
        </div>

        <div className="bg-[#121426] p-6 rounded-2xl border border-white/10 mb-8">
          <h3 className="font-serif text-2xl text-amber-200 mb-4 border-b border-white/10 pb-2">
            The Jyotish Core Synthesis
          </h3>
          <div className="space-y-4 text-sm text-white/80 leading-relaxed font-mono">
            <p><strong>The Core Self:</strong> {deepSynthesis.basicKundali}</p>
            <p><strong>Time & Cycles:</strong> {deepSynthesis.basicDasha}</p>
            <p><strong>Energy & Power:</strong> {deepSynthesis.basicPower}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-[#121426] p-6 rounded-2xl border border-white/10">
            <h3 className="font-serif text-lg text-amber-200 mb-3 border-b border-white/10 pb-2">Natal Matrix Highlights</h3>
            <ul className="text-sm space-y-4 font-mono">
              <li><span className="text-white/60 inline-block w-28">Ascendant:</span> <span className="font-bold text-amber-100">{ch.d1.lagna}</span></li>
              <li><span className="text-white/60 inline-block w-28">Moon Sign:</span> <span className="font-bold text-amber-100">{ch.moonSign}</span></li>
              <li><span className="text-white/60 inline-block w-28">Sun Sign:</span> <span className="font-bold text-amber-100">{ch.sunSign}</span></li>
              <li><span className="text-white/60 inline-block w-28">Nakshatra:</span> <span className="font-bold text-amber-100">{ch.nak}</span></li>
            </ul>
          </div>
          
          <div className="bg-[#121426] p-6 rounded-2xl border border-white/10">
            <h3 className="font-serif text-lg text-amber-200 mb-3 border-b border-white/10 pb-2">Dynamic Prescriptions</h3>
            <ul className="text-sm space-y-4 font-mono">
              <li><span className="text-white/60 inline-block w-24">Deity:</span> <span className="font-bold text-amber-100">{dynamicRx.deity}</span></li>
              <li><span className="text-white/60 inline-block w-24">Gemstone:</span> <span className="font-bold text-amber-100">{dynamicRx.gem}</span></li>
              <li><span className="text-white/60 inline-block w-24">Charity:</span> <span className="font-bold text-amber-100">{dynamicRx.charity}</span></li>
            </ul>
            <div className="mt-5 text-sm text-amber-400 bg-black/30 p-4 rounded-lg border border-white/5">
              <span className="text-white/60 block mb-1 uppercase text-[10px] tracking-widest">Active Mantra:</span> {dynamicRx.mantra}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* PAGE 2: ASTROLOGICAL CHARTS & BIORHYTHMS   */}
      {/* ========================================== */}
      <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Astrological Charts & Energy Cycles</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-[#121426] p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[350px]">
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d1} ch={ch} kpTable={null} style="NORTH" isExpert={false} titleDesc="North Indian (Diamond)" />}
          </div>
          <div className="bg-[#121426] p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[350px]">
            {window.KundaliRenderer && <window.KundaliRenderer ac={ch.d1} ch={ch} kpTable={null} style="SOUTH" isExpert={false} titleDesc="South Indian (Grid)" />}
          </div>
        </div>

        <div className="bg-[#121426] p-8 rounded-2xl border border-white/10">
          <h3 className="font-serif text-2xl text-amber-200 mb-4 border-b border-white/10 pb-2">30-Day Biorhythm Progression</h3>
          
          <p className="text-sm text-white/80 leading-relaxed font-mono mb-8 bg-black/30 p-5 rounded-xl border border-white/5">
            {deepSynthesis.pdfBiorhythm}
          </p>

          <div className="flex justify-between items-center mb-8 font-mono px-10">
            <div className="text-center">
              <div className="text-xs text-red-400 mb-1 tracking-widest uppercase">Physical</div>
              <div className="text-3xl font-bold">{formatBio(bioScores.p)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-blue-400 mb-1 tracking-widest uppercase">Emotional</div>
              <div className="text-3xl font-bold">{formatBio(bioScores.e)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-amber-400 mb-1 tracking-widest uppercase">Intellectual</div>
              <div className="text-3xl font-bold">{formatBio(bioScores.i)}%</div>
            </div>
          </div>

          <div className="relative w-full h-40 bg-gradient-to-b from-black/40 to-black/10 rounded-xl border border-white/10 p-4">
            <svg viewBox="0 -10 100 60" preserveAspectRatio="none" className="w-full h-full opacity-80 overflow-visible">
              <line x1="0" y1="20" x2="100" y2="20" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="0.5" strokeDasharray="2,2" />
              <path d={getWave(23)} fill="none" stroke="#F87171" strokeWidth="2" />
              <path d={getWave(28)} fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="3,2" />
              <path d={getWave(33)} fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="6,3" />
              <line x1="50" y1="-10" x2="50" y2="50" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-black/60 px-3 py-1 rounded border border-white/20">TODAY</div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* PAGE 3: PLANETARY LEDGER (ISOLATED)        */}
      {/* ========================================== */}
        <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Planetary Alignments & Coordinates</h3>
        
        <div className="bg-[#121426] p-8 rounded-2xl border border-white/10 h-full">
          <h3 className="font-serif text-2xl text-amber-200 mb-6 border-b border-white/10 pb-2">Detailed Planetary Ledger</h3>
          <p className="text-sm text-white/80 leading-relaxed font-mono mb-8 bg-black/30 p-6 rounded-xl border border-white/5">
            This ledger records the precise mathematical coordinates of the celestial bodies at your exact moment of birth. It serves as the foundational data for all astrological predictions and determines the exact sub-rulers (Nakshatras and Padas) that influence your core personality.
          </p>
          <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-8 bg-amber-950/20 p-5 rounded-xl border border-amber-500/20">{deepSynthesis.advLedger}</p>
          <table className="w-full text-base font-mono text-left border-collapse">
            <thead>
              <tr className="text-white/50 uppercase border-b border-white/10 text-sm">
                <th className="pb-4">Graha (Planet)</th>
                <th className="pb-4">Sign</th>
                <th className="pb-4">Longitude</th>
                <th className="pb-4">Nakshatra (Pada)</th>
                <th className="pb-4">Motion</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(details).map(([planet, data]) => {
                const pInfo = window.PLANET_INFO[planet] || { color: '#FFF' };
                return (
                  <tr key={planet} className="border-b border-white/5">
                    <td className="py-5 font-bold" style={{ color: pInfo.color }}>{pInfo.symbol} {planet}</td>
                    <td className="py-5 text-white/90">{data.rashi}</td>
                    <td className="py-5 text-amber-200">{data.longitudeStr}</td>
                    <td className="py-5 text-white/80">{data.nakshatra} ({data.pada})</td>
                    <td className="py-5 text-white/60 text-xs">{data.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================== */}
      {/* PAGE 4: SHADBALA (ISOLATED)                */}
      {/* ========================================== */}
        <div className="pdf-page pdf-shadbala w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Planetary Strengths</h3>

        <div className="bg-[#121426] p-8 rounded-2xl border border-white/10 h-full">
          <h3 className="font-serif text-2xl text-amber-200 mb-6 border-b border-white/10 pb-2">Shadbala (Six-Fold Strength)</h3>
          <p className="text-sm text-white/80 leading-relaxed font-mono mb-10 bg-black/30 p-6 rounded-xl border border-white/5">
            {deepSynthesis.pdfShadbala}
          </p>
          <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-6 bg-amber-950/20 p-5 rounded-xl border border-amber-500/20">{deepSynthesis.shadbalaMeaning}</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ch.shadbala || {}).sort((a,b)=>b[1]-a[1]).map(([planet, score]) => {
              const pInfo = window.PLANET_INFO[planet]; 
              const percentage = Math.min(100, (score / 600) * 100);
              return (
                <div key={planet} className="relative bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="font-bold flex items-center gap-2" style={{ color: pInfo?.color }}>
                      <span className="text-lg">{pInfo?.symbol}</span> {planet}
                    </span>
                    <span className="text-white/80 font-bold">{(score / 60).toFixed(1)} Rupas</span>
                  </div>
                  <div className="h-[8px] bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: pInfo?.color }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 5: JAIMINI KARAKAS (ISOLATED)         */}
      {/* ========================================== */}
      <div className="pdf-page pdf-karakas w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Karmic Blueprint & Life Purpose</h3>
        
        <div className="bg-[#121426] p-8 rounded-2xl border border-white/10 h-full">
          <h3 className="font-serif text-2xl text-amber-200 mb-4 border-b border-white/10 pb-2">Jaimini Chara Karakas</h3>
          <p className="text-sm text-white/80 leading-relaxed font-mono mb-8 bg-black/30 p-6 rounded-xl border border-white/5">
            In Jaimini Astrology, planets are assigned specific roles (Karakas) based entirely on their mathematical degrees, irrespective of the sign they sit in. Your highest degree planet becomes the Atma Karaka (Soul), governing your overarching life purpose.
          </p>
          <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-6 bg-amber-950/20 p-5 rounded-xl border border-amber-500/20">For {profile.name}, each role below identifies a life area where the assigned planet expresses a recurring personal lesson. Read the role together with the planet shown, rather than treating it as a fixed prediction.</p>

          <div className="space-y-6 pdf-karaka-list">
            {Object.entries(jaimini).map(([karaka, planet]) => (
              <div key={karaka} className="bg-black/20 p-6 rounded-xl border border-white/5 flex flex-col gap-3 shadow-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="font-bold text-amber-200 font-mono text-lg">{karaka}</span>
                  <span className="font-bold text-2xl" style={{ color: window.PLANET_INFO[planet]?.color }}>{planet}</span>
                </div>
                <div className="text-sm text-white/80 font-mono leading-relaxed">
                  {deepSynthesis.karakaMeanings[karaka]}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* PAGE 6: BALADI AVASTHAS (ISOLATED)         */}
      {/* ========================================== */}
      <div className="pdf-page pdf-avasthas w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Planetary Potency & Maturity</h3>
        
        <div className="bg-[#121426] p-8 rounded-2xl border border-white/10 h-full">
          <h3 className="font-serif text-2xl text-amber-200 mb-4 border-b border-white/10 pb-2">Baladi Avasthas (Maturity)</h3>
          <p className="text-sm text-white/80 leading-relaxed font-mono mb-8 bg-black/30 p-6 rounded-xl border border-white/5">
            Just because a planet is placed well does not mean it can deliver results. Baladi Avasthas determine the "age" or "potency" of a planet based on its degrees within a specific sign. A planet in "Youth" is highly potent, while a planet that is "Dead" requires intense conscious remediation.
          </p>
          <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-6 bg-amber-950/20 p-5 rounded-xl border border-amber-500/20">These maturity labels explain how readily each planet can express its promise in your chart. A younger state usually acts with more immediate energy; an older or dormant state asks for more time, structure, and conscious effort in that planet's life area.</p>

          <div className="grid grid-cols-2 gap-3 pdf-avastha-list">
            {Object.entries(avasthas).map(([planet, avastha]) => (
              <div key={planet} className="bg-black/20 p-5 rounded-xl border border-white/5 flex flex-col gap-3 shadow-sm">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-bold text-xl" style={{ color: window.PLANET_INFO[planet]?.color }}>{planet}</span>
                  <span className="font-bold text-amber-200 font-mono text-base">{avastha}</span>
                </div>
                <div className="text-sm text-white/80 font-mono">
                  {deepSynthesis.avasthaMeanings[avastha]}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* PAGE 7: CURRENT GOCHARA (ISOLATED)         */}
      {/* ========================================== */}
      <div className="pdf-page pdf-gochara w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Real-Time Gochara (Transit) Impact</h3>
        
        <div className="bg-[#121426] p-8 rounded-2xl border border-white/10 h-full">
          <h3 className="font-serif text-2xl text-amber-200 mb-4 border-b border-white/10 pb-2">Current Planetary Vectors</h3>
          <p className="text-sm text-white/80 leading-relaxed font-mono mb-10 bg-black/30 p-6 rounded-xl border border-white/5">
            While your birth chart is a fixed static map, Gochara translates the real-time movement of the planets in the sky <strong>today</strong> against that fixed map. These planetary transits dictate your immediate, real-world outcomes and shift constantly as the planets orbit.
          </p>
          <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-6 bg-amber-950/20 p-5 rounded-xl border border-amber-500/20">{deepSynthesis.gocharaMeaning}</p>

          <div className="flex flex-col gap-8">
            {Object.entries(gochara).map(([domain, data]) => (
              <div key={domain} className="bg-black/20 p-8 rounded-2xl border border-white/5 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-amber-200 font-serif text-2xl capitalize">{domain.replace(/([A-Z])/g, ' $1').trim()} Sphere</span>
                  <span className="text-amber-400 font-mono font-bold text-xl">{Math.round(data.sc)}/100</span>
                </div>
                <div className="h-3 bg-black/50 rounded-full mb-5 overflow-hidden border border-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400" style={{ width: `${data.sc}%` }}></div>
                </div>
                <div className="text-base text-white/80 font-mono leading-relaxed">
                  {data.text}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* PAGE 8: VIMSHOTTARI DASHA TIMELINE         */}
      {/* ========================================== */}
      <div className="pdf-page pdf-dasha w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Vimshottari Dasha Timeline</h3>
        
        <div className="bg-[#121426] p-8 rounded-2xl border border-white/10 h-full">
          <h3 className="font-serif text-2xl text-amber-200 mb-4 border-b border-white/10 pb-2">Your Active Operating System</h3>
          
          <p className="text-sm text-white/80 leading-relaxed font-mono mb-10 bg-black/30 p-6 rounded-xl border border-white/5">
            {deepSynthesis.pdfDasha}
          </p>
          <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-6 bg-amber-950/20 p-5 rounded-xl border border-amber-500/20">This operating-system metaphor means the active Mahadasha supplies the long-term theme, while the Antardasha describes the shorter-term way that theme is currently experienced in your work, relationships, decisions, and responsibilities.</p>

          <div className="grid grid-cols-2 gap-8 font-mono text-sm">
            {displayDashas.map((d, i) => {
              const isActive = currentYear >= d.start && currentYear < d.end;
              return (
                <div key={i} className={`p-6 border rounded-2xl ${isActive ? 'bg-amber-400/10 border-amber-400/50 shadow-lg shadow-amber-500/10' : 'bg-black/30 border-white/10 opacity-70'}`}>
                  <div className={`font-bold mb-4 ${isActive ? 'text-amber-400 text-xl' : 'text-white text-lg'}`}>
                    {d.lord} Mahadasha <br/>
                    <span className="text-sm text-white/60">({Math.floor(d.start)} - {Math.floor(d.end)})</span>
                  </div>
                  <div className="space-y-4 pl-4 border-l-2 border-white/20 mt-6 text-base">
                    {window.getAntardashas && window.getAntardashas(d.lord, d.start, d.end).slice(0, 6).map((a, j) => (
                      <div key={j} className="flex justify-between text-white/80 py-1">
                        <span>{a.lord} Antar</span>
                        <span>{Math.floor(a.start)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* PAGE 9: 12-MONTH HOROSCOPE (MONTHS 1-3)    */}
      {/* ========================================== */}
      <div className="pdf-page pdf-forecast w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">12-Month Matrix (Q1)</h3>
        <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-5 bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">{deepSynthesis.monthlyMeaning}</p>
        <div className="flex flex-col gap-8">
          {yearlyForecast.slice(0, 3).map((m, idx) => (
            <div key={idx} className="p-6 bg-[#121426] rounded-2xl border border-white/10 shadow-lg">
              <div className="font-bold text-amber-300 font-mono text-xl mb-4 border-b border-white/5 pb-3">{m.month}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-white/80">
                <div className="col-span-1 md:col-span-2 bg-black/30 p-4 rounded-lg border border-white/5">
                  <span className="text-amber-400 font-bold block mb-1">General Focus:</span> {m.general}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-blue-300 font-bold block mb-1">Career:</span> {m.career}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-green-300 font-bold block mb-1">Wealth:</span> {m.wealth}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-pink-300 font-bold block mb-1">Home:</span> {m.home}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-red-300 font-bold block mb-1">Health:</span> {m.health}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 10: 12-MONTH HOROSCOPE (MONTHS 4-6)   */}
      {/* ========================================== */}
      <div className="pdf-page pdf-forecast w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">12-Month Matrix (Q2)</h3>
        <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-5 bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">{deepSynthesis.monthlyMeaning}</p>
        <div className="flex flex-col gap-8">
          {yearlyForecast.slice(3, 6).map((m, idx) => (
            <div key={idx} className="p-6 bg-[#121426] rounded-2xl border border-white/10 shadow-lg">
              <div className="font-bold text-amber-300 font-mono text-xl mb-4 border-b border-white/5 pb-3">{m.month}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-white/80">
                <div className="col-span-1 md:col-span-2 bg-black/30 p-4 rounded-lg border border-white/5">
                  <span className="text-amber-400 font-bold block mb-1">General Focus:</span> {m.general}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-blue-300 font-bold block mb-1">Career:</span> {m.career}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-green-300 font-bold block mb-1">Wealth:</span> {m.wealth}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-pink-300 font-bold block mb-1">Home:</span> {m.home}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-red-300 font-bold block mb-1">Health:</span> {m.health}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 11: 12-MONTH HOROSCOPE (MONTHS 7-9)   */}
      {/* ========================================== */}
      <div className="pdf-page pdf-forecast w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">12-Month Matrix (Q3)</h3>
        <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-5 bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">{deepSynthesis.monthlyMeaning}</p>
        <div className="flex flex-col gap-8">
          {yearlyForecast.slice(6, 9).map((m, idx) => (
            <div key={idx} className="p-6 bg-[#121426] rounded-2xl border border-white/10 shadow-lg">
              <div className="font-bold text-amber-300 font-mono text-xl mb-4 border-b border-white/5 pb-3">{m.month}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-white/80">
                <div className="col-span-1 md:col-span-2 bg-black/30 p-4 rounded-lg border border-white/5">
                  <span className="text-amber-400 font-bold block mb-1">General Focus:</span> {m.general}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-blue-300 font-bold block mb-1">Career:</span> {m.career}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-green-300 font-bold block mb-1">Wealth:</span> {m.wealth}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-pink-300 font-bold block mb-1">Home:</span> {m.home}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-red-300 font-bold block mb-1">Health:</span> {m.health}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 12: 12-MONTH HOROSCOPE (MONTHS 10-12) */}
      {/* ========================================== */}
      <div className="pdf-page pdf-forecast w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
        <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">12-Month Matrix (Q4)</h3>
        <p className="text-sm text-amber-100/90 leading-relaxed font-mono mb-5 bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">{deepSynthesis.monthlyMeaning}</p>
        <div className="flex flex-col gap-8">
          {yearlyForecast.slice(9, 12).map((m, idx) => (
            <div key={idx} className="p-6 bg-[#121426] rounded-2xl border border-white/10 shadow-lg">
              <div className="font-bold text-amber-300 font-mono text-xl mb-4 border-b border-white/5 pb-3">{m.month}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-white/80">
                <div className="col-span-1 md:col-span-2 bg-black/30 p-4 rounded-lg border border-white/5">
                  <span className="text-amber-400 font-bold block mb-1">General Focus:</span> {m.general}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-blue-300 font-bold block mb-1">Career:</span> {m.career}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-green-300 font-bold block mb-1">Wealth:</span> {m.wealth}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-pink-300 font-bold block mb-1">Home:</span> {m.home}
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                  <span className="text-red-300 font-bold block mb-1">Health:</span> {m.health}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 13: UNION MILAN (IF SELECTED)         */}
      {/* ========================================== */}
      {(() => {
        try {
          const savedPair = JSON.parse(localStorage.getItem('astrograh_union_pair') || '[]');
          if (Array.isArray(savedPair) && savedPair.length === 2) {
            const ashtakoot = window.calculateAshtakoot ? window.calculateAshtakoot(savedPair[0], savedPair[1]) : null;
            if (ashtakoot) {
              return (
                <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                  <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Ashtakoot Milan (Compatibility)</h3>
                  <div className="bg-[#121426] p-6 rounded-2xl border border-white/10 mb-6">
                    <p className="text-sm text-white/80 mb-4 font-mono">The 36-point Ashtakoot compatibility system measures harmony across 8 dimensions of life partnership.</p>
                    <div className="text-lg font-bold text-amber-300 mb-2">Total Score: {Math.round(ashtakoot.totalScore)}/36</div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 mb-4">
                      <div className="h-full bg-gradient-to-r from-amber-600 to-emerald-400" style={{ width: `${Math.min(100, (ashtakoot.totalScore / 36) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(ashtakoot).filter(([k]) => k !== 'totalScore').map(([param, points]) => (
                      <div key={param} className="bg-black/30 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-white/60 uppercase font-mono mb-1 tracking-widest">{param}</div>
                        <div className="font-bold text-amber-200 text-lg">{points}/3</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          }
        } catch (e) {}
        return null;
      })()}

      {/* ========================================== */}
      {/* PAGE 14: PALMISTRY HISTORY (IF AVAILABLE)  */}
      {/* ========================================== */}
      {(() => {
        try {
          const storageKey = `astrograh_palmistry_history_${profile?.id || 'guest'}`;
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            const valid = parsed.filter((item) => Date.now() - new Date(item.ts).getTime() <= 30 * 24 * 60 * 60 * 1000);
            if (valid.length > 0) {
              const latest = valid[valid.length - 1];
              return (
                <div className="pdf-page w-[794px] h-[1123px] bg-[#0b0d19] text-[#F2EFE6] p-10 font-sans relative overflow-hidden box-border">
                  <h3 className="font-serif text-3xl text-amber-400 mb-6 border-b border-amber-400/30 pb-2">Hand Palmistry Analysis</h3>
                  <div className="bg-[#121426] p-6 rounded-2xl border border-white/10 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-amber-300 text-xl">Hand Style</div>
                      <div className="text-white/80 font-mono text-sm">{new Date(latest.ts).toLocaleDateString()}</div>
                    </div>
                    <div className="text-lg font-bold text-amber-200 mb-4">{latest.style}</div>
                    <div className="text-white/80 font-mono text-sm leading-relaxed bg-black/30 p-4 rounded-lg border border-white/5">
                      {latest.analysis}
                    </div>
                  </div>
                  <div className="mt-8 text-xs text-white/50 font-mono uppercase tracking-widest">
                    Palmistry readings from the last 30 days: {valid.length} capture(s)
                  </div>
                </div>
              );
            }
          }
        } catch (e) {}
        return null;
      })()}

    </div>
  );
});