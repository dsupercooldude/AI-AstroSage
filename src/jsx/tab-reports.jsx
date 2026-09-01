// src/jsx/tab-reports.jsx
var React = window.React;

window.ReportsTab = ({ pr, ch, date }) => {
  if (!ch || !ch.planetaryDegrees) return <div className="p-4 text-center text-sm t60">Calculating Astral Data...</div>;

  // CORE CALCULATIONS
  const details = window.calculatePlanetaryDetails ? window.calculatePlanetaryDetails(ch.d1?.signs || {}, ch.planetaryDegrees) : {};
  const jaimini = window.calculateJaiminiKarakas ? window.calculateJaiminiKarakas(ch.planetaryDegrees) : {};
  const avasthas = window.calculateBaladiAvastha ? window.calculateBaladiAvastha(ch.planetaryDegrees, ch.d1?.placements || {}) : {};

  // JAIMINI PERSONALIZATION EXTRACTION
  const akPlanet = jaimini["Atma Karaka (AK)"] || "Sun";
  const amkPlanet = jaimini["Amatya Karaka (AmK)"] || "Moon";
  const dkPlanet = jaimini["Dara Karaka (DK)"] || "Venus";

  const soulLessons = {
    Sun: "mastering true leadership, overcoming ego, and discovering your inner authority",
    Moon: "mastering your emotions, nurturing others, and maintaining healthy personal boundaries",
    Mars: "channeling raw energy, displaying immense courage, and protecting others through disciplined action",
    Mercury: "mastering communication, intellectual pursuits, and resolving life's dualities through logic",
    Jupiter: "seeking ultimate wisdom, higher learning, and guiding others through philosophical expansion",
    Venus: "focusing on profound relationships, universal harmony, and balancing material beauty with devotion",
    Saturn: "learning extreme perseverance, accepting limitations, and finding immense peace in duty"
  };

  const careerPaths = {
    Sun: "placing yourself in visible positions of authority and command",
    Moon: "utilizing empathy, public relations, or caring for the needs of the masses",
    Mars: "taking bold initiatives, engineering solutions, and thriving in high-pressure conflict resolution",
    Mercury: "leveraging writing, speaking, commerce, and rapid analytical thinking",
    Jupiter: "teaching, advising, financial planning, or guiding corporate/spiritual ethics",
    Venus: "working in design, luxury, diplomacy, or roles requiring deep relationship management",
    Saturn: "embracing long-term, structured, and heavy administrative or organizational roles"
  };

  // AVASTHAS PERSONALIZATION LOGIC
  const peakPlanets = Object.entries(avasthas).filter(([p, a]) => a.includes("Yuva") || a.includes("Kumara")).map(([p]) => p);
  const weakPlanets = Object.entries(avasthas).filter(([p, a]) => a.includes("Mrita") || a.includes("Vriddha")).map(([p]) => p);

  const peakText = peakPlanets.length > 0 
    ? `Your ${peakPlanets.join(" and ")} ${peakPlanets.length > 1 ? 'are' : 'is'} in a highly active state (Yuva/Kumara), delivering peak vibrancy and undeniable results in your life.` 
    : `Currently, none of your core planets are in their absolute peak youth state, meaning you must rely on strategic timing over brute force.`;

  const weakText = weakPlanets.length > 0 
    ? `However, your ${weakPlanets.join(" and ")} ${weakPlanets.length > 1 ? 'are' : 'is'} in a dormant or fatigued state (Mrita/Vriddha). You will need specific conscious effort and mantra remediation to unlock the benefits promised by ${weakPlanets.length > 1 ? 'these planets' : 'this planet'}.` 
    : `Impressively, none of your core planets are in a fatigued or dead state! Your cosmic battery is exceptionally well-charged.`;

  return (
    <div className="space-y-6 pb-12 gl-fadein mt-4">
      
      {/* 1. PLANETARY LEDGER TABLE */}
      <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl flex flex-col w-full">
        <h3 className="font-serif text-base text-amber-200 mb-4 flex items-center gap-2">
          <i className="ph ph-planet" style={{ fontSize: 20 }}></i> Detailed Planetary Ledger & Longitudes
        </h3>
        <div className="overflow-x-auto mb-4 w-full">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 t50 text-[10px] uppercase">
                <th className="pb-3">Graha</th>
                <th className="pb-3">Rashi (Sign)</th>
                <th className="pb-3">Longitude</th>
                <th className="pb-3">Nakshatra (Pada)</th>
                <th className="pb-3">Motion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(details).map(([planet, data]) => {
                const pInfo = window.PLANET_INFO[planet] || { color: "#FFF", symbol: "●" };
                return (
                  <tr key={planet} className="hover:bg-white/5 transition">
                    <td className="py-3 font-bold" style={{ color: pInfo.color }}>{pInfo.symbol} {planet}</td>
                    <td className="py-3 t90">{data.rashi}</td>
                    <td className="py-3 text-amber-200">{data.longitudeStr}</td>
                    <td className="py-3 t80">{data.nakshatra} (P-{data.pada})</td>
                    <td className="py-3 t60 text-[10px]">{data.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* DYNAMIC LEDGER SYNTHESIS - Replaced the copy/paste error with the actual code */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs t85 leading-relaxed shadow-inner font-mono mt-2">
          <strong className="text-amber-400 block mb-2">What this means for your specific chart:</strong> 
          {window.generateDeepSynthesis ? (window.generateDeepSynthesis(pr, ch, window.bio ? window.bio(pr?.dob, date || new Date(), pr?.utcOffset) : {p:0,e:0,i:0}, date || new Date()).advLedger || "This ledger translates each planet, sign, degree, nakshatra, and motion into plain-language guidance about your strengths, habits, relationships, responsibilities, and areas for patient improvement.") : "This ledger translates each planet, sign, degree, nakshatra, and motion into plain-language guidance about your strengths, habits, relationships, responsibilities, and areas for patient improvement."}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
        {/* 2. JAIMINI CHARA KARAKAS */}
        <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl flex flex-col h-full w-full">
          <h3 className="font-serif text-sm text-amber-200 mb-3">Jaimini Chara Karakas</h3>
          <div className="space-y-2 font-mono text-xs mb-4 flex-grow">
            {Object.entries(jaimini).map(([karaka, planet]) => {
              const pInfo = window.PLANET_INFO[planet] || { color: "#FFF" };
              return (
                <div key={karaka} className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-xl border border-white/5">
                  <span className="t60">{karaka}</span>
                  <span className="font-bold" style={{ color: pInfo.color }}>{planet}</span>
                </div>
              );
            })}
          </div>
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs t85 leading-relaxed shadow-inner">
            <strong className="text-amber-400 block mb-2">Your Personal Karmic Mission:</strong>
            ● <strong>Your Soul Purpose (Atma Karaka):</strong> Because your highest degree planet is <strong style={{ color: window.PLANET_INFO[akPlanet]?.color }}>{akPlanet}</strong>, your ultimate destiny in this lifetime revolves around {soulLessons[akPlanet] || "discovering your unique path"}.<br/><br/>
            ● <strong>Your Career Guide (Amatya Karaka):</strong> With <strong style={{ color: window.PLANET_INFO[amkPlanet]?.color }}>{amkPlanet}</strong> acting as your career minister, you will achieve your greatest worldly success by {careerPaths[amkPlanet] || "focusing on your innate talents"}.<br/><br/>
            ● <strong>Your Partner (Dara Karaka):</strong> Your lowest degree planet is <strong style={{ color: window.PLANET_INFO[dkPlanet]?.color }}>{dkPlanet}</strong>, dictating that you attract and require long-term partners who heavily embody the traits of {dkPlanet}.
          </div>
        </div>

        {/* 3. BALADI AVASTHAS */}
        <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl flex flex-col h-full w-full">
          <h3 className="font-serif text-sm text-amber-200 mb-3">Planetary Baladi Avasthas</h3>
          <div className="space-y-2 font-mono text-xs max-h-[220px] overflow-y-auto pr-1 mb-4 flex-grow beauty-scroll">
            {Object.entries(avasthas).map(([planet, avastha]) => {
              const pInfo = window.PLANET_INFO[planet] || { color: "#FFF" };
              return (
                <div key={planet} className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-xl border border-white/5">
                  <span style={{ color: pInfo.color }} className="font-bold">{planet}</span>
                  <span className="t85 text-[11px]">{avastha}</span>
                </div>
              );
            })}
          </div>
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs t85 leading-relaxed shadow-inner">
            <strong className="text-amber-400 block mb-2">Your Planetary Battery Life:</strong> 
            Avasthas reveal the actual operating maturity of your planets.<br/><br/>
            ● {peakText}<br/><br/>
            ● {weakText}
          </div>
        </div>
      </div>
    </div>
  );
};
