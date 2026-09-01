// src/js/ai-rules.js

// ══════════════════════════════════════════════════════════════════════════════
// 1. CLOUD AI GATEWAY (MULTI-PROVIDER API ROUTER)
// ══════════════════════════════════════════════════════════════════════════════
window.executeMultiProviderAI = async (prompt, settings, systemPrompt) => {
  const keys = Object.fromEntries(Object.entries(settings?.apiKeys || {}).map(([id, key]) => [id, typeof key === "string" ? key.trim() : key]));
  const preferredModel = settings?.aiModel || "auto";
  const failures = [];

  const callGemini = async (apiKey) => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      })
    });
    if (!res.ok) {
      let detail = "";
      try { detail = (await res.json())?.error?.message || ""; } catch (e) {}
      throw new Error(`Gemini HTTP ${res.status}${detail ? `: ${detail}` : ""}`);
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  };

  const callOpenAI = async (apiKey) => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096
      })
    });
    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  };

  const callGroq = async (apiKey) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096
      })
    });
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  };

  const callDeepSeek = async (apiKey) => {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096
      })
    });
    if (!res.ok) throw new Error(`DeepSeek HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  };

  const callKimi = async (apiKey) => {
    const res = await fetch("https://api.moonshot.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096
      })
    });
    if (!res.ok) throw new Error(`Kimi HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  };

  const callOpenRouter = async (apiKey) => {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
        max_tokens: 4096
      })
    });
    if (!res.ok) throw new Error(`OpenRouter HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  };

  const callHuggingFace = async (apiKey) => {
    const res = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${systemPrompt}\n\nUser Question: ${prompt} [/INST]`,
        parameters: { max_new_tokens: 4096, return_full_text: false }
      })
    });
    if (!res.ok) throw new Error(`HuggingFace HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
  };

  const providers = [
    { id: "gemini", fn: callGemini, key: keys.gemini },
    { id: "openai", fn: callOpenAI, key: keys.openai },
    { id: "groq", fn: callGroq, key: keys.groq },
    { id: "deepseek", fn: callDeepSeek, key: keys.deepseek },
    { id: "kimi", fn: callKimi, key: keys.kimi },
    { id: "openrouter", fn: callOpenRouter, key: keys.openrouter },
    { id: "huggingface", fn: callHuggingFace, key: keys.huggingface }
  ];

  if (preferredModel !== "auto" && preferredModel !== "offline") {
    const target = providers.find((p) => p.id === preferredModel);
    if (target && target.key) {
      try {
        const txt = await target.fn(target.key);
        if (txt) return { text: txt, provider: target.id };
      } catch (err) {
        failures.push(`${preferredModel}: ${err.message}`);
        console.warn(`Preferred provider ${preferredModel} failed, cascading...`, err);
      }
    }
  }

  const availableProviders = providers.filter((prov) => prov.key);
  const cursorKey = "gl_ai_provider_cursor";
  let cursor = 0;
  try { cursor = Number.parseInt(localStorage.getItem(cursorKey) || "0", 10) || 0; } catch (e) {}
  const rotatedProviders = availableProviders.length ? availableProviders.map((_, index) => availableProviders[(cursor + index) % availableProviders.length]) : [];
  for (const prov of rotatedProviders) {
      try {
        const txt = await prov.fn(prov.key);
        if (txt) {
          try { localStorage.setItem(cursorKey, String((providers.findIndex((item) => item.id === prov.id) + 1) % providers.length)); } catch (e) {}
          window.lastAIProviderErrors = failures;
          return { text: txt, provider: prov.id };
        }
      } catch (err) {
        failures.push(`${prov.id}: ${err.message}`);
        console.warn(`Provider ${prov.id} failed, trying next...`, err);
      }
  }
  window.lastAIProviderErrors = failures;
  return null;
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. OFFLINE VEDIC RULE ENGINE (DETERMINISTIC TEXT GENERATION)
// ══════════════════════════════════════════════════════════════════════════════

window.getYearlyForecastData = (pr, ch, targetDate) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const startMonth = targetDate.getMonth();
  const startYear = targetDate.getFullYear();
  
  const cT = [
    "Strategic execution and milestone delivery",
    "Networking and alliance building",
    "Deep focus on complex problem solving",
    "High-visibility leadership and command"
  ];
  
  const wT = [
    "Conservative saving and ledger auditing",
    "Aggressive investment in assets",
    "Portfolio review and tax optimization",
    "Sudden windfall potential through tech"
  ];
  
  const hT = [
    "Domestic expansion and family gatherings",
    "Property maintenance and structural upgrades",
    "Emotional grounding and quiet retreat",
    "Resolving ancestral or familial disputes"
  ];
  
  const hlT = [
    "Vitality peaking. Excellent for physical training",
    "Monitor stress levels. Prioritize sleep hygiene",
    "Dietary adjustments needed. Focus on digestion",
    "Mental fatigue possible. Pranic breathing required"
  ];
  
  const gT = {
    Aries: "career acceleration", Taurus: "steady wealth accumulation", Gemini: "intellectual research",
    Cancer: "emotional grounding", Leo: "executive command", Virgo: "meticulous architecture",
    Libra: "strategic alliances", Scorpio: "deep transformations", Sagittarius: "philosophical expansion",
    Capricorn: "structural discipline", Aquarius: "technological innovation", Pisces: "intuitive design flow"
  };

  const activeGeneral = gT[ch.d1.lagna] || "karmic progression";
  const forecastArray = [];

  for (let i = 0; i < 12; i++) {
    const mIdx = (startMonth + i) % 12;
    const y = startYear + Math.floor((startMonth + i) / 12);
    forecastArray.push({
      month: `${months[mIdx]} ${y}`,
      general: `A period heavily emphasizing ${activeGeneral}. Transiting planetary matrices cross referencing your ${ch.moonSign} Moon indicate broad progressive stability.`,
      career: cT[i % 4],
      wealth: wT[(i + 1) % 4],
      home: hT[(i + 2) % 4],
      health: hlT[(i + 3) % 4]
    });
  }
  return forecastArray;
};

window.generateOfflineYearlyHoroscope = (pr, ch, targetDate) => {
  const data = window.getYearlyForecastData(pr, ch, targetDate);
  let report = "YEARLY FORECAST (Month-by-Month Deterministic Engine)\n────────────────────────────────────────────────────────\n\n";
  data.forEach(m => {
    report += `• **${m.month}**\n  - **General:** ${m.general}\n  - **Career:** ${m.career}\n  - **Wealth:** ${m.wealth}\n  - **Home:** ${m.home}\n  - **Health:** ${m.health}\n\n`;
  });
  return report;
};

window.runVedicRuleEngine = (query, profile, kundli, targetDate, learnedContext = "") => {
  const lQ = query.toLowerCase();
  
  if (lQ.includes("yearly horoscope") || lQ.includes("month-by-month")) {
    return window.generateOfflineYearlyHoroscope(profile, kundli, targetDate);
  }
  
  const dateFormatted = targetDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  const b = window.bio ? window.bio(profile?.dob, targetDate, profile?.utcOffset) : { p: 0, e: 0, i: 0 };
  const pK = window.WEEKDAY ? window.WEEKDAY[targetDate.getDay()] : "Sun";
  const rulingPlanet = { Sun: "Sun", Mon: "Moon", Tue: "Mars", Wed: "Mercury", Thu: "Jupiter", Fri: "Venus", Sat: "Saturn" }[pK] || "Sun";
  
  const currentDecYear = targetDate.getFullYear() + (targetDate.getMonth() / 12) + (targetDate.getDate() / 365);
  const mahaObj = kundli.dasha?.find((d) => currentDecYear >= d.start && currentDecYear < d.end);
  const activeMaha = mahaObj ? mahaObj.lord : "Jupiter";
  let activeAntar = activeMaha;
  
  if (mahaObj && window.getAntardashas) {
    activeAntar = window.getAntardashas(activeMaha, mahaObj.start, mahaObj.end)
      .find((a) => currentDecYear >= a.start && currentDecYear < a.end)?.lord || activeMaha;
  }

  let domain = "Comprehensive Vedic Life Guidance";
  let analysis = `**Native:** ${profile?.name || "Native"} | **Target Date:** ${dateFormatted}\n**Core Matrix:** ${kundli.d1.lagna} Lagna, Moon in ${kundli.nak} (Pada ${kundli.pada}).\n**Current Cosmic Rulers:** ${activeMaha} Mahadasha is guiding your overarching karmic trajectory, with day energy governed by ${rulingPlanet}.${learnedContext ? `\n**Learned conversation context:** ${learnedContext}` : ""}`;
  let roadmap = `1. **Strategic Decisions:** Align high-value tasks with favorable Choghadiya windows visible in your Panchang tab.\n2. **Energy Output:** Maintain balanced output tailored to your 15-day biorhythms (P: ${Math.round(((b.p + 1) / 2) * 100)}%, E: ${Math.round(((b.e + 1) / 2) * 100)}%, I: ${Math.round(((b.i + 1) / 2) * 100)}%).`;
  let muhurtaRemedy = `Recite the Beej Mantra for today's active Hora ruler (${rulingPlanet}): "${window.PLANET_INFO?.[rulingPlanet]?.beej}".`;

  if (lQ.includes("target") || lQ.includes("career")) {
    domain = "Career Milestones & Revenue Achievement";
    analysis = `**Transit Matrix:** Jupiter transits ${kundli.transits?.Jupiter}, Saturn transits ${kundli.transits?.Saturn}.\n**Active Cycle:** ${activeMaha} / ${activeAntar} axis.\n**Cognitive:** Intellect biorhythm is ${Math.round(((b.i + 1) / 2) * 100)}%.`;
    roadmap = `1. Target Alignment: Execute formal contract milestones during your ruling ${pK} Horas and Abhijit Muhurta.\n2. Negotiation Vector: Anchor multi-party deliverables with verifiable data to satisfy Saturnian rigor.`;
    muhurtaRemedy = `Chant "${window.PLANET_INFO?.[activeMaha]?.beej}" for sustained career momentum.`;
  }
  
  return `### 📍 DOMAIN: ${domain}\n\n## 1. DATA-DRIVEN VEDIC SYNTHESIS:\n${analysis}\n\n## 2. PRESCRIBED ACTION ROADMAP:\n${roadmap}\n\n## 3. DIVINE REMEDY & MANTRAS:\n* ${muhurtaRemedy}\n* **Daily Action:** ${window.PLANET_INFO?.[rulingPlanet]?.action}`;
};
