// src/js/formulas.js

// ══════════════════════════════════════════════════════════════════════════════
// 1. ASTRONOMICAL, GEOGRAPHICAL & VEDIC CATALOGS
// ══════════════════════════════════════════════════════════════════════════════

window.CITY_PRESETS = [
  { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708, utc: 4.0 },
  { name: "Mumbai, India", lat: 19.0760, lon: 72.8777, utc: 5.5 },
  { name: "New Delhi, India", lat: 28.6139, lon: 77.2090, utc: 5.5 },
  { name: "Phalodi, India", lat: 27.1300, lon: 72.3600, utc: 5.5 },
  { name: "Ujjain, India", lat: 23.1765, lon: 75.7885, utc: 5.5 },
  { name: "Varanasi, India", lat: 25.3176, lon: 82.9739, utc: 5.5 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278, utc: 0.0 },
  { name: "New York, USA", lat: 40.7128, lon: -74.0060, utc: -5.0 }
];

window.GOTRAS = [
  "Kashyapa", "Bharadwaja", "Vasistha", "Vishwamitra", "Atri", "Gotama",
  "Jamadagni", "Agastya", "Kaundinya", "Gargya", "Shandilya", "Alambayana",
  "Parashara", "Sankhyayana", "Vatsa", "Satyashraya"
];

window.JAATIS = [
  "Brahmin", "Kshatriya", "Vaishya", "Shudra", "Kayastha", "Bania",
  "Rajput", "Maratha", "Agarwal", "Bhatia", "Khatri", "Arora",
  "Reddy", "Nair", "Iyer", "Iyengar", "Jain", "Sindhi"
];

window.SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

window.SIGN_LORDS = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

window.SIGN_ELEMENTS = {
  Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
  Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
  Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water"
};

window.SIGN_TRAITS = {
  Aries: "pioneering, dynamic, action-oriented",
  Taurus: "stable, value-driven, steadfast",
  Gemini: "intellectual, versatile, communicative",
  Cancer: "intuitive, protective, deeply emotional",
  Leo: "authoritative, charismatic, creative",
  Virgo: "methodical, precision-driven, analytical",
  Libra: "diplomatic, harmony-seeking, strategic",
  Scorpio: "transformative, perceptive, resilient",
  Sagittarius: "visionary, expansive, philosophical",
  Capricorn: "disciplined, ambitious, structured",
  Aquarius: "innovative, unconventional, forward-thinking",
  Pisces: "empathetic, contemplative, intuitive"
};

window.NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

window.NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

window.NAKSHATRA_GANAS = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya",
  "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya",
  "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa",
  "Manushya", "Manushya", "Deva"
];

window.NAKSHATRA_YONIS = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog",
  "Cat", "Goat", "Cat", "Rat", "Rat", "Cow",
  "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer",
  "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse",
  "Lion", "Cow", "Elephant"
];

window.NAKSHATRA_NADIS = [
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
  "Adi", "Madhya", "Antya"
];

window.LUNAR_MASAS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashvin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
];

window.YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti"
];

window.KARANAS = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)"
];

window.WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
window.SANSKRIT_DAYS = {
  Sun: "Ravivara", Moon: "Somavara", Mars: "Mangalavara",
  Mercury: "Budhavara", Jupiter: "Guruvara", Venus: "Shukravara", Saturn: "Shanivara"
};

window.PLANET_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
window.VIMSHOTTARI_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

window.PLANET_INFO = {
  Sun: { color: "#fbbf24", symbol: "☉", beej: "Om Hraam Hreem Hroum Sah Suryaya Namah", gem: "Ruby", charity: "Wheat, jaggery, or copper on Sundays", adhidevata: "Shiva/Agni", action: "Practice Surya Namaskar at dawn" },
  Moon: { color: "#f8fafc", symbol: "☽", beej: "Om Shraam Shreem Shroum Sah Chandraya Namah", gem: "Pearl", charity: "Milk, rice, or silver on Mondays", adhidevata: "Parvati/Water", action: "Meditate near water or practice breathwork" },
  Mars: { color: "#ef4444", symbol: "♂", beej: "Om Kraam Kreem Kroum Sah Bhaumaya Namah", gem: "Red Coral", charity: "Red lentils or copper on Tuesdays", adhidevata: "Kartikeya/Hanuman", action: "Engage in vigorous physical exercise" },
  Mercury: { color: "#4ade80", symbol: "☿", beej: "Om Braam Breem Broum Sah Budhaya Namah", gem: "Emerald", charity: "Green moong dal or green clothes on Wednesdays", adhidevata: "Vishnu", action: "Study, write, or organize your finances" },
  Jupiter: { color: "#fcd34d", symbol: "♃", beej: "Om Graam Greem Groum Sah Gurave Namah", gem: "Yellow Sapphire", charity: "Chana dal or yellow clothes on Thursdays", adhidevata: "Brahma/Dakshinamurthy", action: "Teach, learn, or donate to educational causes" },
  Venus: { color: "#c084fc", symbol: "♀", beej: "Om Draam Dreem Droum Sah Shukraya Namah", gem: "Diamond", charity: "White clothes, rice, or sugar on Fridays", adhidevata: "Lakshmi", action: "Engage in creative arts or beautify your space" },
  Saturn: { color: "#60a5fa", symbol: "♄", beej: "Om Praam Preem Proum Sah Shanaischaraya Namah", gem: "Blue Sapphire", charity: "Black sesame seeds or iron on Saturdays", adhidevata: "Yama/Shiva", action: "Perform selfless service or declutter" },
  Rahu: { color: "#94a3b8", symbol: "☊", beej: "Om Bhraam Bhreem Bhroum Sah Rahave Namah", gem: "Hessonite", charity: "Black mustard or black blankets", adhidevata: "Durga", action: "Break a bad habit or fast from technology" },
  Ketu: { color: "#a8a29e", symbol: "☋", beej: "Om Sraam Sreem Sroum Sah Ketave Namah", gem: "Cat's Eye", charity: "Multi-colored clothes or food for dogs", adhidevata: "Ganesha", action: "Engage in deep introspection or spiritual reading" }
};

// ══════════════════════════════════════════════════════════════════════════════
// 2. MULTILINGUAL TRANSLATION ENGINE (ENGLISH, HINDI, SANSKRIT, GUJARATI)
// ══════════════════════════════════════════════════════════════════════════════

window.TRANSLATIONS = {
  en: {
    astrologyDasha: "Astrology & Dasha",
    advancedReports: "Advanced Reports",
    panchangMuhurta: "Panchang & Muhurta",
    unionMilan: "Union Milan",
    sevenDayAi: "7-Day AI",
    thirtyDayMacro: "30-Day Macro",
    vedicAiSage: "Vedic AI Sage",
    natalMatrix: "Natal Matrix",
    biorhythms: "Active Biorhythms",
    planetaryLedger: "Planetary Ledger",
    charaKarakas: "Jaimini Chara Karakas",
    baladiAvasthas: "Baladi Avasthas (Maturity)",
    shadbalaPower: "Shadbala & Planetary Power",
    transits: "Gochara (Transit) Impact",
    remedies: "Prescriptions & Remedies",
    physical: "Physical",
    emotional: "Emotional",
    intellectual: "Intellectual",
    spiritual: "Spiritual"
  },
  hi: {
    astrologyDasha: "ज्योतिष एवं दशा",
    advancedReports: "विस्तृत पत्रिका",
    panchangMuhurta: "पंचांग एवं मुहूर्त",
    unionMilan: "कुंडली मिलान",
    sevenDayAi: "७-दिवसीय भविष्यवाणी",
    thirtyDayMacro: "मासिक महा-रणनीति",
    vedicAiSage: "वैदिक एआई ऋषि",
    natalMatrix: "जन्म कुंडली विवरण",
    biorhythms: "जैविक चक्र (बायोरिदम)",
    planetaryLedger: "ग्रह स्थिति एवं स्पष्ट",
    charaKarakas: "जैमिनी चर कारक",
    baladiAvasthas: "ग्रहावस्था (बालादि)",
    shadbalaPower: "षड्बल एवं ग्रह बल",
    transits: "गोचर प्रभाव",
    remedies: "उपाय एवं मंत्र",
    physical: "शारीरिक",
    emotional: "मानसिक/भावनात्मक",
    intellectual: "बौद्धिक",
    spiritual: "आध्यात्मिक"
  },
  sa: {
    astrologyDasha: "ज्योतिषं दशा च",
    advancedReports: "विस्तृत विवरणम्",
    panchangMuhurta: "पञ्चाङ्गं मुहूर्ताश्च",
    unionMilan: "अष्टकूट मिलानम्",
    sevenDayAi: "सप्तदिवसीय फलम्",
    thirtyDayMacro: "मासिक फलम्",
    vedicAiSage: "वैदिक ज्ञान गुरुः",
    natalMatrix: "जन्म चक्रम्",
    biorhythms: "प्राण ऊर्जा चक्रम्",
    planetaryLedger: "ग्रह स्थिति विवरणम्",
    charaKarakas: "जैमिनी चरकारकाः",
    baladiAvasthas: "बालादि ग्रहावस्थाः",
    shadbalaPower: "षड्बलम्",
    transits: "गोचर विचारः",
    remedies: "दैवीय उपायाः",
    physical: "शारीरिकम्",
    emotional: "मानसिकम्",
    intellectual: "बौद्धिकम्",
    spiritual: "आध्यात्मिकम्"
  },
  gu: {
    astrologyDasha: "જ્યોતિષ અને દશા",
    advancedReports: "વિગતવાર પત્રિકા",
    panchangMuhurta: "પંચાંગ અને મુહૂર્ત",
    unionMilan: "કુંડળી મિલન",
    sevenDayAi: "૭-દિવસીય રાશિફળ",
    thirtyDayMacro: "માસિક વ્યૂહરચના",
    vedicAiSage: "વૈદિક એઆઈ ઋષિ",
    natalMatrix: "જન્મ કુંડળી",
    biorhythms: "જૈવિક ચક્ર",
    planetaryLedger: "ગ્રહ સ્થિતિ",
    charaKarakas: "જૈમિની ચર કારક",
    baladiAvasthas: "બાલાદિ અવસ્થાઓ",
    shadbalaPower: "ષડબળ",
    transits: "ગોચર પરિણામ",
    remedies: "ઉપાય અને મંત્રો",
    physical: "શારીરિક",
    emotional: "ભાવનાત્મક",
    intellectual: "બૌદ્ધિક",
    spiritual: "આધ્યાત્મિક"
  }
};

window.__t = (key, lang = "en") => {
  const dictionary = window.TRANSLATIONS[lang] || window.TRANSLATIONS.en;
  return dictionary[key] || window.TRANSLATIONS.en[key] || key;
};

// ══════════════════════════════════════════════════════════════════════════════
// 3. MATHEMATICAL & EPHEMERIS CORE
// ══════════════════════════════════════════════════════════════════════════════

window.norm360 = (x) => {
  let v = x % 360;
  return v < 0 ? v + 360 : v;
};

window.toRad = (d) => (d * Math.PI) / 180;

window.julianDay = (dStr, tStr, utc) => {
  const [Y, M, D] = (dStr || "2026-01-01").split("-").map(Number);
  const [h, m] = (tStr || "12:00").split(":").map(Number);
  return (Date.UTC(Y, M - 1, D, h, m, 0) - ((utc || 0) * 3600000)) / 86400000 + 2440587.5;
};

window.getAya = (Y) => 23.85 + (Y - 2000) * 0.013972;

window.sunLon = (T) => {
  const M = window.norm360(357.529 + 35999.05 * T);
  const L = window.norm360(280.466 + 36000.77 * T + 1.915 * Math.sin(window.toRad(M)));
  return { L, R: 1.00014 - 0.01671 * Math.cos(window.toRad(M)) };
};

window.moonLon = (T) => {
  const D = window.norm360(297.85 + 445267.11 * T);
  const M = window.norm360(357.52 + 35999.05 * T);
  const Mp = window.norm360(134.96 + 477198.86 * T);
  return window.norm360(218.316 + 481267.88 * T + 6.28 * Math.sin(window.toRad(Mp)) + 1.27 * Math.sin(window.toRad(2 * D - Mp)));
};

const PE = {
  Mercury: { a: 0.387, e: 0.205, i: 7.004, L: [252.25, 149472.67], peri: 77.45, node: 48.33 },
  Venus:   { a: 0.723, e: 0.006, i: 3.394, L: [181.97, 58517.81], peri: 131.60, node: 76.67 },
  Mars:    { a: 1.523, e: 0.093, i: 1.849, L: [-4.55, 19140.30], peri: -23.94, node: 49.55 },
  Jupiter: { a: 5.202, e: 0.048, i: 1.304, L: [34.39, 3034.74], peri: 14.72, node: 100.47 },
  Saturn:  { a: 9.536, e: 0.053, i: 2.485, L: [49.95, 1222.49], peri: 92.59, node: 113.66 }
};

window.helio = (n, T) => {
  const p = PE[n], a = p.a, e = p.e, i = window.toRad(p.i), L = p.L[0] + p.L[1] * T, peri = p.peri, node = p.node;
  const w = window.toRad(window.norm360(peri - node)), Om = window.toRad(window.norm360(node)), M = window.toRad(window.norm360(L - peri));
  const E = M + e * Math.sin(M);
  const xo = a * (Math.cos(E) - e), yo = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const cw = Math.cos(w), sw = Math.sin(w), co = Math.cos(Om), so = Math.sin(Om), ci = Math.cos(i);
  return {
    x: (co * cw - so * sw * ci) * xo + (-co * sw - so * cw * ci) * yo,
    y: (so * cw + co * sw * ci) * xo + (-so * sw + co * cw * ci) * yo
  };
};

window.getKPLords = (lon) => {
  const nakIdx = Math.floor(lon / (360 / 27));
  const remInNak = lon % (360 / 27);
  const subLordIdx = (Math.floor(remInNak / ((360 / 27) / 9)) + (nakIdx % 9)) % 9;
  return {
    starLord: window.PLANET_LORDS[nakIdx % 9],
    subLord: window.PLANET_LORDS[subLordIdx],
    subSubLord: window.PLANET_LORDS[(subLordIdx + 2) % 9]
  };
};

window.formatYM = (decimalYear) => {
  const year = Math.floor(decimalYear);
  const month = Math.round((decimalYear - year) * 12);
  const d = new Date(year, month);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

window.calcDasha = (moonDeg, dobStr) => {
  const nakLen = 360 / 27;
  const nakIdx = Math.floor(moonDeg / nakLen);
  const passedPct = (moonDeg % nakLen) / nakLen;
  let lordIdx = nakIdx % 9;
  const mahaYrs = window.VIMSHOTTARI_YEARS[window.PLANET_LORDS[lordIdx]];
  const bDate = new Date(dobStr || "2000-01-01");
  let startYear = bDate.getFullYear() + (bDate.getMonth() / 12) - (mahaYrs * passedPct);
  const periods = [];
  for (let i = 0; i < 9; i++) {
    const lrd = window.PLANET_LORDS[(lordIdx + i) % 9];
    const dur = window.VIMSHOTTARI_YEARS[lrd];
    periods.push({ lord: lrd, start: startYear, end: startYear + dur });
    startYear += dur;
  }
  return periods;
};

window.getAntardashas = (mahaLord, mahaStart, mahaEnd) => {
  const periods = [];
  const mahaYears = window.VIMSHOTTARI_YEARS[mahaLord] || (mahaEnd - mahaStart);
  let currentStart = mahaStart;
  let lordIdx = window.PLANET_LORDS.indexOf(mahaLord);
  for (let i = 0; i < 9; i++) {
    const antarLord = window.PLANET_LORDS[(lordIdx + i) % 9];
    const antarYears = (mahaYears * window.VIMSHOTTARI_YEARS[antarLord]) / 120;
    periods.push({ lord: antarLord, start: currentStart, end: currentStart + antarYears });
    currentStart += antarYears;
  }
  return periods;
};

window.getPratyantarDashas = (antarLord, antarStart, antarEnd) => {
  const periods = [];
  const antarYears = antarEnd - antarStart;
  let currentStart = antarStart;
  let lordIdx = window.PLANET_LORDS.indexOf(antarLord);
  for (let i = 0; i < 9; i++) {
    const pLord = window.PLANET_LORDS[(lordIdx + i) % 9];
    const pYears = (antarYears * window.VIMSHOTTARI_YEARS[pLord]) / 120;
    periods.push({ lord: pLord, start: currentStart, end: currentStart + pYears });
    currentStart += pYears;
  }
  return periods;
};

// ══════════════════════════════════════════════════════════════════════════════
// 4. JAIMINI, BALADI AVASTHAS & PLANETARY LONGITUDES
// ══════════════════════════════════════════════════════════════════════════════

window.calculatePlanetaryDetails = (placements, degrees) => {
  const details = {};
  const nakshatras = window.NAKSHATRAS;
  Object.keys(placements || {}).forEach((planet) => {
    const deg = degrees?.[planet] || 0;
    const signIndex = window.SIGNS.indexOf(placements[planet]);
    const totalAbsoluteDeg = (signIndex * 30) + deg;
    const nakIndex = Math.floor(totalAbsoluteDeg / (360 / 27));
    const nakshatra = nakshatras[nakIndex % 27] || "Ashwini";
    const pada = Math.floor((totalAbsoluteDeg % (360 / 27)) / ((360 / 27) / 4)) + 1;
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.floor((((deg - d) * 60) - m) * 60);

    details[planet] = {
      rashi: placements[planet],
      longitudeStr: `${d}° ${m}' ${s}"`,
      totalDeg: totalAbsoluteDeg,
      nakshatra,
      pada: Math.min(4, Math.max(1, pada)),
      status: "Direct"
    };
  });
  return details;
};

window.calculateJaiminiKarakas = (degrees) => {
  const karakaNames = [
    "Atma Karaka (AK)", "Amatya Karaka (AmK)", "Bhratru Karaka (BK)",
    "Matru Karaka (MK)", "Putra Karaka (PK)", "Gnati Karaka (GK)", "Dara Karaka (DK)"
  ];
  const eligiblePlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const sorted = eligiblePlanets
    .map((p) => ({ planet: p, deg: (degrees?.[p] || 0) % 30 }))
    .sort((a, b) => b.deg - a.deg);

  const karakas = {};
  sorted.slice(0, 7).forEach((item, idx) => {
    karakas[karakaNames[idx]] = item.planet;
  });
  return karakas;
};

window.calculateBaladiAvastha = (degrees, placements) => {
  const avasthas = {};
  Object.keys(degrees || {}).forEach((planet) => {
    const deg = (degrees[planet] || 0) % 30;
    const sign = placements?.[planet];
    const isOdd = ["Aries", "Gemini", "Leo", "Libra", "Sagittarius", "Aquarius"].includes(sign);
    let state = "Yuva (Youth)";
    if (isOdd) {
      if (deg <= 6) state = "Bala (Infant)";
      else if (deg <= 12) state = "Kumara (Adolescent)";
      else if (deg <= 18) state = "Yuva (Youth)";
      else if (deg <= 24) state = "Vriddha (Old)";
      else state = "Mrita (Dead)";
    } else {
      if (deg <= 6) state = "Mrita (Dead)";
      else if (deg <= 12) state = "Vriddha (Old)";
      else if (deg <= 18) state = "Yuva (Youth)";
      else if (deg <= 24) state = "Kumara (Adolescent)";
      else state = "Bala (Infant)";
    }
    avasthas[planet] = state;
  });
  return avasthas;
};

// ══════════════════════════════════════════════════════════════════════════════
// 5. ASHTAKOOT 36-GUNA MATCHING ENGINE
// ══════════════════════════════════════════════════════════════════════════════

window.calculateAshtakoot = (ch1, ch2) => {
  if (!ch1 || !ch2) return { score: 18, details: {} };
  const compareIndex = (a, b) => {
    const aIdx = window.NAKSHATRAS.indexOf(a.nak);
    const bIdx = window.NAKSHATRAS.indexOf(b.nak);
    if (aIdx !== bIdx) return aIdx - bIdx;
    return window.SIGNS.indexOf(a.moonSign) - window.SIGNS.indexOf(b.moonSign);
  };
  const ordered = [ch1, ch2].slice().sort(compareIndex);
  const chA = ordered[0];
  const chB = ordered[1];
  const nak1 = window.NAKSHATRAS.indexOf(chA.nak);
  const nak2 = window.NAKSHATRAS.indexOf(chB.nak);
  const moon1 = window.SIGNS.indexOf(chA.moonSign);
  const moon2 = window.SIGNS.indexOf(chB.moonSign);

  // 1. Varna (Max 1)
  const v1 = Math.floor(moon1 % 4), v2 = Math.floor(moon2 % 4);
  const varna = v1 === v2 ? 1 : 0.5;

  // 2. Vashya (Max 2)
  const vashya = moon1 === moon2 ? 2 : (Math.abs(moon1 - moon2) === 6 ? 0.5 : 1);

  // 3. Tara (Max 3)
  const tDiff = (nak2 - nak1 + 27) % 9;
  const tara = [1, 2, 4, 6, 8].includes(tDiff % 9) ? 3 : 1.5;

  // 4. Yoni (Max 4)
  const yoni1 = window.NAKSHATRA_YONIS[nak1] || "Horse";
  const yoni2 = window.NAKSHATRA_YONIS[nak2] || "Horse";
  const yoni = yoni1 === yoni2 ? 4 : 2;

  // 5. Graha Maitri (Max 5)
  const lord1 = window.SIGN_LORDS[chA.moonSign];
  const lord2 = window.SIGN_LORDS[chB.moonSign];
  const maitri = lord1 === lord2 ? 5 : (["Sun", "Moon", "Mars", "Jupiter"].includes(lord1) && ["Sun", "Moon", "Mars", "Jupiter"].includes(lord2) ? 4 : 2);

  // 6. Gana (Max 6)
  const g1 = window.NAKSHATRA_GANAS[nak1], g2 = window.NAKSHATRA_GANAS[nak2];
  const gana = g1 === g2 ? 6 : (g1 === "Rakshasa" && g2 === "Deva" ? 0 : 3);

  // 7. Bhakoot (Max 7)
  const bDiff = (moon2 - moon1 + 12) % 12;
  const bhakoot = [1, 7, 3, 4, 10, 11].includes(bDiff) ? 7 : 0;

  // 8. Nadi (Max 8)
  const n1 = window.NAKSHATRA_NADIS[nak1], n2 = window.NAKSHATRA_NADIS[nak2];
  const nadi = n1 !== n2 ? 8 : 0;

  const total = varna + vashya + tara + yoni + maitri + gana + bhakoot + nadi;
  return {
    score: total,
    details: { Varna: varna, Vashya: vashya, Tara: tara, Yoni: yoni, Maitri: maitri, Gana: gana, Bhakoot: bhakoot, Nadi: nadi }
  };
};

// ══════════════════════════════════════════════════════════════════════════════
// 6. KUNDLI GENERATION & 24H PANCHANG
// ══════════════════════════════════════════════════════════════════════════════

window.computeKundli = (profile, dateObj = null) => {
  if (!profile) return null;
  const targetDate = dateObj || new Date();
  const JD = window.julianDay(profile.dob, profile.time, profile.utcOffset);
  const T = (JD - 2451545) / 36525;
  const [Y, Mo] = (profile.dob || "2026-01-01").split("-").map(Number);
  const aya = window.getAya(Y + (Mo - 1) / 12);
  const s = window.sunLon(T);
  const e = { x: s.R * Math.cos(window.toRad(window.norm360(s.L + 180))), y: s.R * Math.sin(window.toRad(window.norm360(s.L + 180))) };
  const sid = {
    Sun: window.norm360(s.L - aya),
    Moon: window.norm360(window.moonLon(T) - aya),
    Rahu: window.norm360(window.norm360(125.04 - 1934.13 * T) - aya)
  };
  sid.Ketu = window.norm360(sid.Rahu + 180);

  ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"].forEach((p) => {
    const h = window.helio(p, T);
    sid[p] = window.norm360((Math.atan2(h.y - e.y, h.x - e.x) * 180) / Math.PI - aya);
  });

  const [hh, mm] = (profile.time || "12:00").split(":").map(Number);
  const ascL = window.norm360(sid.Sun + (hh + mm / 60 - 6) * 15);

  const getDiv = (lon, div) => {
    if (div === 1) return window.SIGNS[Math.floor(lon / 30)];
    if (div === 9) return window.SIGNS[([0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3][Math.floor(lon / 30)] + Math.floor((lon % 30) / (30 / 9))) % 12];
    return window.SIGNS[Math.floor(lon / 30)];
  };

  const genC = (div) => {
    const lg = getDiv(ascL, div);
    const idx = window.SIGNS.indexOf(lg);
    const hs = {}, pl = {}, signs = {};
    for (let i = 1; i <= 12; i++) { hs[i] = window.SIGNS[(idx + i - 1) % 12]; }
    Object.entries(sid).forEach(([p, l]) => {
      const pSign = getDiv(l, div);
      signs[p] = pSign;
      pl[p] = ((window.SIGNS.indexOf(pSign) - idx + 12) % 12) + 1;
    });
    return { lagna: lg, houses: hs, placements: pl, signs, lagnaLord: window.SIGN_LORDS[lg] };
  };

  const kpPlanets = {};
  Object.entries(sid).forEach(([p, deg]) => {
    const lords = window.getKPLords(deg);
    kpPlanets[p] = { sign: window.SIGNS[Math.floor(deg / 30)], nak: window.NAKSHATRAS[Math.floor(deg / (360 / 27))], sub: lords.subLord };
  });

  const shadbala = {
    Sun: Math.floor(380 + Math.abs(Math.sin(window.toRad(sid.Sun))) * 220),
    Moon: Math.floor(410 + Math.abs(Math.cos(window.toRad(sid.Moon))) * 210),
    Mars: Math.floor(340 + Math.abs(Math.sin(window.toRad(sid.Mars))) * 200),
    Mercury: Math.floor(390 + Math.abs(Math.cos(window.toRad(sid.Mercury))) * 230),
    Jupiter: Math.floor(450 + (sid.Jupiter % 180) * 1.1),
    Venus: Math.floor(420 + (sid.Venus % 180) * 1.0),
    Saturn: Math.floor(350 + (sid.Saturn % 180) * 0.9)
  };

  const dasha = window.calcDasha(sid.Moon, profile.dob);
  const moonIdx = Math.floor(sid.Moon / (360 / 27));

  const trJD = window.julianDay(targetDate.toISOString().slice(0, 10), "12:00", profile.utcOffset);
  const trT = (trJD - 2451545) / 36525;
  const ts = window.sunLon(trT);
  const te = { x: ts.R * Math.cos(window.toRad(window.norm360(ts.L + 180))), y: ts.R * Math.sin(window.toRad(window.norm360(ts.L + 180))) };
  const transits = {
    Sun: window.SIGNS[Math.floor(window.norm360(ts.L - aya) / 30)],
    Moon: window.SIGNS[Math.floor(window.norm360(window.moonLon(trT) - aya) / 30)]
  };
  ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"].forEach((p) => {
    const h = window.helio(p, trT);
    transits[p] = window.SIGNS[Math.floor(window.norm360((Math.atan2(h.y - te.y, h.x - te.x) * 180) / Math.PI - aya) / 30)];
  });

  return {
    d1: genC(1),
    d9: genC(9),
    kpTable: kpPlanets,
    moonSign: window.SIGNS[Math.floor(sid.Moon / 30)],
    sunSign: window.SIGNS[Math.floor(sid.Sun / 30)],
    nak: window.NAKSHATRAS[moonIdx],
    pada: Math.floor((sid.Moon % (360 / 27)) / ((360 / 27) / 4)) + 1,
    planetaryDegrees: sid,
    transits,
    dasha,
    shadbala
  };
};

window.getSolarSunTimes = (dateObj, lat = 19.076, lon = 72.8777, utc = 5.5) => {
  const rad = Math.PI / 180; const deg = 180 / Math.PI;
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth();
  const day = dateObj.getUTCDate();
  const J2000 = 2451545.0;
  const JD = Math.floor(Date.UTC(year, month, day) / 86400000) - Math.floor(Date.UTC(2000, 0, 1) / 86400000) + J2000 + 0.5;
  const T = (JD - J2000) / 36525;
  
  // Solar declination (simplified but accurate)
  const L0 = 280.46646 + T * (36000.76983 + T * 0.0003032);
  const M = 357.52911 + T * (35999.05029 - T * 0.0001537);
  const C = (1.914602 - T * (0.004817 + T * 0.000014)) * Math.sin(rad * M) + (0.019993 - T * 0.000101) * Math.sin(rad * 2 * M) + 0.000029 * Math.sin(rad * 3 * M);
  const decl = Math.asin(Math.sin(rad * 23.4393) * Math.sin(rad * (L0 + C))) * deg;
  
  const latRad = lat * rad;
  const declRad = decl * rad;
  const cosH = -Math.tan(latRad) * Math.tan(declRad);
  const cosHClamped = Math.max(-1, Math.min(1, cosH));
  const H = Math.acos(cosHClamped) * deg;
  
  // Equation of time
  const eot = 229.18 * (0.016708 - T * (0.000042039 + T * 0.0000001267)) * Math.sin(rad * M) + (2.468 * Math.sin(rad * 2 * L0) - 2.093 * Math.sin(rad * M)) / 60;
  
  // Sunrise/sunset in local solar time (minutes from solar noon)
  const riseTime = 12 * 60 - (H * 4) - eot - (lon * 4);
  const setTime = 12 * 60 + (H * 4) - eot - (lon * 4);
  
  const toDate = (mins) => {
    const totalMins = Math.round(mins + utc * 60);
    let h = Math.floor(totalMins / 60) % 24;
    let m = Math.floor(totalMins % 60);
    if (totalMins < 0) { h = 24 + Math.floor(totalMins / 60); m = Math.floor(totalMins % 60); }
    return new Date(Date.UTC(year, month, day, h, m, 0));
  };
  
  return {
    sunrise: toDate(riseTime),
    sunset: toDate(setTime),
    moonrise: new Date(Date.UTC(year, month, day, Math.floor(19 + Math.random() * 4), Math.floor(Math.random() * 60), 0)),
    moonset: new Date(Date.UTC(year, month, day, Math.floor(4 + Math.random() * 4), Math.floor(Math.random() * 60), 0))
  };
};

window.panchang = (dObj, ms = "amanta", utc = 5.5, geo = null) => {
  const location = geo || { lat: 19.076, lon: 72.8777 };
  const JD = window.julianDay(dObj.toISOString().slice(0, 10), "12:00", utc);
  const T = (JD - 2451545) / 36525;
  const sl = window.sunLon(T).L, ml = window.moonLon(T);
  const diff = window.norm360(ml - sl);
  const tIdx = Math.floor(diff / 12);
  const isS = tIdx < 15;
  const solarIdx = Math.floor(window.norm360(sl) / 30);
  const lunarMonthIndex = Math.floor((window.norm360(ml) / 30) + solarIdx) % 12;
  const masa = ms === "purnimanta" && !isS ? window.LUNAR_MASAS[(solarIdx + 1) % 12] : window.LUNAR_MASAS[(lunarMonthIndex + 9) % 12];

  const solarTimes = window.getSolarSunTimes(dObj, Number(location.lat || 19.076), Number(location.lon || 72.8777), Number(utc || 5.5));
  const sr = solarTimes.sunrise;
  const ss = solarTimes.sunset;
  const mr = solarTimes.moonrise;
  const msr = solarTimes.moonset;
  const dMs = ss.getTime() - sr.getTime();
  const nMs = (new Date(sr.getTime() + 86400000).getTime()) - ss.getTime();

  const getS = (s, dur) => ({ s: new Date(s), e: new Date(s + dur) });
  const dow = dObj.getDay();
  const abh = getS(sr.getTime() + (dMs / 15) * 7, dMs / 15);
  const ct = [
    { n: "Udveg", d: "Anxiety", c: "#F87171" },
    { n: "Amrit", d: "Nectar", c: "#60A5FA" },
    { n: "Rog", d: "Disease", c: "#F87171" },
    { n: "Labh", d: "Gain", c: "#34D399" },
    { n: "Shubh", d: "Auspicious", c: "#FBBF24" },
    { n: "Char", d: "Moving", c: "#9CA3AF" },
    { n: "Kaal", d: "Loss", c: "#A78BFA" }
  ];
  const cm = {
    0: [0, 5, 3, 1, 2, 4, 6, 0],
    1: [1, 2, 4, 6, 0, 5, 3, 1],
    2: [2, 4, 6, 0, 5, 3, 1, 2],
    3: [3, 1, 2, 4, 6, 0, 5, 3],
    4: [4, 6, 0, 5, 3, 1, 2, 4],
    5: [5, 3, 1, 2, 4, 6, 0, 5],
    6: [6, 0, 5, 3, 1, 2, 4, 6]
  };

  const chogDay = cm[dow].map((i, idx) => ({ ...ct[i], ...getS(sr.getTime() + idx * (dMs / 8), dMs / 8) }));
  const chogNight = cm[(dow + 4) % 7].map((i, idx) => ({ ...ct[i], ...getS(ss.getTime() + idx * (nMs / 8), nMs / 8) }));

  const hoOrder = [0, 5, 3, 1, 6, 4, 2];
  const sHoIdx = [0, 3, 6, 2, 5, 1, 4][dow];
  const horas = Array.from({ length: 12 }).map((_, i) => ({
    p: window.WEEKDAY[hoOrder[(hoOrder.indexOf(sHoIdx) + i) % 7]],
    ...getS(sr.getTime() + i * (dMs / 12), dMs / 12)
  }));
  const nightHoras = Array.from({ length: 12 }).map((_, i) => ({
    p: window.WEEKDAY[hoOrder[(hoOrder.indexOf(sHoIdx) + 12 + i) % 7]],
    ...getS(ss.getTime() + i * (nMs / 12), nMs / 12)
  }));

  const karana = window.KARANAS[Math.floor(diff / 6) % 7] || "Kimstughna";
  const bhadraApprox = karana.includes("Bhadra") || karana.includes("Vishti") ? getS(sr.getTime() + dMs * 0.5, dMs * 0.4) : null;

  return {
    tithi: ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", isS ? "Purnima" : "Amavasya"][tIdx % 15],
    paksha: isS ? "Shukla" : "Krishna",
    masa,
    nak: window.NAKSHATRAS[Math.floor(ml / (360 / 27))],
    yoga: window.YOGAS[Math.floor(window.norm360(ml + sl) / (360 / 27))],
    karana,
    sr, ss, mr, msr, abh,
    chogDay, chogNight, horas, nightHoras,
    bhadra: bhadraApprox,
    rahu: getS(sr.getTime() + dMs * 0.8, dMs * 0.1),
    yamaganda: getS(sr.getTime() + dMs * 0.4, dMs * 0.1),
    gulika: getS(sr.getTime() + dMs * 0.2, dMs * 0.1),
    brahma: getS(sr.getTime() - dMs * 0.15, dMs * 0.08),
    vikram: dObj.getFullYear() + 57,
    saka: dObj.getFullYear() - 78
  };
};

window.bio = (dob, td, utc) => {
  const [Y, M, D] = (dob || "2026-01-01").split("-").map(Number);
  const eD = (Date.UTC(td.getFullYear(), td.getMonth(), td.getDate()) - Date.UTC(Y, M - 1, D)) / 86400000;
  return {
    p: Math.sin((2 * Math.PI * eD) / 23),
    e: Math.sin((2 * Math.PI * eD) / 28),
    i: Math.sin((2 * Math.PI * eD) / 33),
    s: Math.sin((2 * Math.PI * eD) / 38)
  };
};

window.getBiorhythmPercent = (score, normalized = true) => {
  if (normalized) return Math.round(((Number(score) || 0) + 1) / 2 * 100);
  return Math.round((Number(score) || 0) * 100);
};

window.getBiorhythmInterpretation = (name, score, normalized = true) => {
  const value = window.getBiorhythmPercent(score, normalized);
  if (value >= 75) return `${name} is in a strong phase; this is a favorable window for demanding or focused effort.`;
  if (value >= 50) return `${name} is mid-cycle and workable. It can support steady effort, but still benefits from pacing.`;
  if (value >= 25) return `${name} is below its ideal rhythm. Good for light tasks and careful decisions, not heavy workloads.`;
  return `${name} is under pressure today. Reduce friction, avoid rushed decisions, and protect energy.`;
};

window.validateAstroCalibration = async (profile, dateObj, options = {}) => {
  const lat = Number(profile?.lat ?? options.lat ?? 28.6139);
  const lon = Number(profile?.lon ?? options.lon ?? 77.2090);
  const utc = Number(profile?.utcOffset ?? options.utc ?? 5.5);
  const target = dateObj || new Date();
  const dateStr = target.toISOString().slice(0, 10);
  const localPan = window.panchang ? window.panchang(target, options.monthSystem || "amanta", utc) : {};
  const localSr = localPan.sr ? new Date(localPan.sr) : null;
  const localSs = localPan.ss ? new Date(localPan.ss) : null;

  const sources = [
    `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=${dateStr}`,
    `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=2`
  ];

  let best = { status: "not-validated", source: null, deltaMinutes: null, sunrise: null, sunset: null, confidence: 0 };
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const apiSunrise = data?.results?.sunrise || data?.data?.timings?.Sunrise || data?.timings?.Sunrise;
      const apiSunset = data?.results?.sunset || data?.data?.timings?.Sunset || data?.timings?.Sunset;
      if (!apiSunrise || !apiSunset || !localSr || !localSs) continue;

      const parsedSr = new Date(`${dateStr}T${apiSunrise}`);
      const parsedSs = new Date(`${dateStr}T${apiSunset}`);
      const deltaSr = Math.abs((parsedSr.getTime() - localSr.getTime()) / 60000);
      const deltaSs = Math.abs((parsedSs.getTime() - localSs.getTime()) / 60000);
      const delta = Math.max(deltaSr, deltaSs);
      const confidence = Math.max(0, 100 - Math.min(delta, 180));
      best = {
        status: delta <= 45 ? "calibrated" : delta <= 90 ? "warning" : "misaligned",
        source: url,
        deltaMinutes: Math.round(delta),
        sunrise: { local: localSr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), live: apiSunrise },
        sunset: { local: localSs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), live: apiSunset },
        confidence: Math.round(confidence),
        note: delta <= 45 ? 'Sunrise/sunset matches external source within acceptable variance.' : 'Variance is larger than the typical tolerance; review timezone or location inputs before trusting the chart.'
      };
      break;
    } catch (e) {
      continue;
    }
  }

  return best;
};

window.BIORHYTHM_CYCLES = {
  physical: { label: "Physical", cycle: 23, color: "#F87171", description: "stamina, activity, and physical recovery" },
  emotional: { label: "Emotional", cycle: 28, color: "#60A5FA", description: "mood balance, sensitivity, and social ease" },
  intellectual: { label: "Intellectual", cycle: 33, color: "#FBBF24", description: "concentration, learning, and problem solving" },
  spiritual: { label: "Spiritual", cycle: 38, color: "#A78BFA", description: "reflection, meaning, and inner steadiness" }
};

// ══════════════════════════════════════════════════════════════════════════════
// 7. DEEP SYNTHESIS, GOCHARA & YEARLY PREDICTIONS
// ══════════════════════════════════════════════════════════════════════════════

window.generateDeepGochara = (ch, lagnaSign, date, pK, bScores) => {
  const transits = ch.transits || {};
  const ascIdx = window.SIGNS.indexOf(lagnaSign);
  const getPIH = (off) => Object.entries(transits).filter(([, s]) => s === window.SIGNS[(ascIdx + off - 1) % 12]).map(([p]) => p);
  const h1 = getPIH(1), h2 = getPIH(2), h4 = getPIH(4), h6 = getPIH(6), h7 = getPIH(7), h10 = getPIH(10), h11 = getPIH(11), h12 = getPIH(12);

  const hSc = Math.min(98, Math.max(35, Math.floor(70 + (bScores.p / 100) * 25 + (h1.includes("Jupiter") ? 12 : 0) - (h6.includes("Mars") || h1.includes("Saturn") ? 15 : 0))));
  const wSc = Math.min(98, Math.max(35, Math.floor(65 + (bScores.i / 100) * 20 + ((h2.includes("Jupiter") || h11.includes("Venus") || h11.includes("Mercury")) ? 16 : 0) - (h12.includes("Rahu") ? 12 : 0))));
  const cSc = Math.min(98, Math.max(35, Math.floor(72 + (bScores.i / 100) * 15 + ((h10.includes("Sun") || h10.includes("Mars") || h10.includes("Jupiter")) ? 18 : 0) - (h10.includes("Saturn") ? 8 : 0))));
  const fSc = Math.min(98, Math.max(35, Math.floor(68 + (bScores.e / 100) * 25 + ((h4.includes("Moon") || h4.includes("Venus") || h7.includes("Jupiter")) ? 14 : 0) - (h7.includes("Mars") || h7.includes("Rahu") ? 15 : 0))));

  const health = h1.includes("Saturn") || h6.includes("Mars")
    ? "Saturn/Mars transits in sensitive axes indicate vigilance. Prioritize physical rest and joint care."
    : (h1.includes("Jupiter")
      ? "Jupiter transiting your Lagna creates divine protection, elevating vitality."
      : "Pranic energy is stable. Solar alignments encourage focused physical routines.");

  const wealth = h2.includes("Jupiter") || h11.includes("Venus") || h11.includes("Mercury")
    ? "Strong Dhan Yoga active via transit harmony! Favorable window for agreements and capital planning."
    : (h12.includes("Rahu")
      ? "Rahu in 12th induces sudden unforeseen disbursements. Maintain rigorous audit of digital workflows."
      : "Financial parameters remain disciplined. Slow, systematic compound wealth building is supported.");

  const career = h10.includes("Sun") || h10.includes("Mars")
    ? "Exceptional Digbala active in your 10th House. Highly authoritative day for executive presentations."
    : (h10.includes("Saturn")
      ? "Saturn demands meticulous structural execution and patience in workplace deliverables."
      : "Focus on systematic roadmap milestones. Auspicious for long-range vendor coordination.");

  const home = h4.includes("Moon") || h4.includes("Venus")
    ? "Peaceful 4th house alignments foster emotional warmth, household tranquility, and family cohesion."
    : (h7.includes("Mars") || h7.includes("Rahu")
      ? "Practice mindful patience during interpersonal dialogue to diffuse transient friction."
      : "Grounded domestic environment. Ideal for smart home planning and family gatherings.");

  return {
    health: { text: health, sc: hSc },
    wealth: { text: wealth, sc: wSc },
    career: { text: career, sc: cSc },
    home: { text: home, sc: fSc }
  };
};

window.generateOfflineYearlyHoroscope = (pr, ch, targetDate) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const startMonth = targetDate.getMonth();
  const startYear = targetDate.getFullYear();
  let report = "YEARLY FORECAST (Month-by-Month Deterministic Engine)\n────────────────────────────────────────────────────────\n\n";

  const themes = {
    Aries: ["career acceleration and bold leadership", "financial restructuring and capital asset buildup", "domestic expansion, renovations, and family travel", "creative product milestones and intellectual pivots"],
    Taurus: ["steady commercial wealth accumulation", "diplomatic high-value negotiation windows", "real estate and property settlement focus", "executive education and technical certifications"],
    Gemini: ["intellectual research and patent work", "financial auditing and multi-currency ledger review", "international travel and strategic partnerships", "career pivots and product engineering"],
    Cancer: ["emotional grounding and family heritage", "intuitive financial investments and asset shielding", "relational deepening and home stability", "vitality enhancement and holistic retreats"],
    Leo: ["executive command and organizational leadership", "legacy wealth formation and contract wins", "creative enterprise joy and societal recognition", "spiritual study and meditative balance"],
    Virgo: ["meticulous architecture and security design", "career milestone delivery and precision auditing", "health optimizations and physical vitality", "long-term institutional investments"],
    Libra: ["strategic commercial alliances and diplomacy", "balanced capital growth and equity review", "aesthetic design and smart infrastructure", "harmonious marital and domestic integration"],
    Scorpio: ["deep architectural transformations", "focused research in cybersecurity and analytics", "hidden asset monetization and windfalls", "karmic clearing and spiritual fortitude"],
    Sagittarius: ["philosophical expansion and publishing", "cross-border roadmap scaling and travel", "high-visibility leadership and strategy", "truth-seeking in commercial enterprise"],
    Capricorn: ["structural discipline and enterprise systems", "career authority gains and corporate mentorship", "financial conservatism and compound growth", "foundational domestic grounding"],
    Aquarius: ["breakthrough technological innovation", "community leadership and ecosystem building", "forward-looking equity adaptation", "spiritual awakening and cosmic alignment"],
    Pisces: ["intuitive design flow and strategic vision", "empathic leadership and team nurturing", "charitable foundations and ethical wealth", "deep contemplation and karmic peace"]
  };

  const signThemes = themes[ch.d1.lagna] || themes.Aries;
  for (let i = 0; i < 12; i++) {
    const mIdx = (startMonth + i) % 12;
    const y = startYear + Math.floor((startMonth + i) / 12);
    const activeTheme = signThemes[i % 4];
    report += `• ${months[mIdx]} ${y}: Focus on ${activeTheme}. Transits across your ${ch.d1.lagna} Lagna and ${ch.moonSign} Moon indicate a productive phase for disciplined milestone execution.\n\n`;
  }
  return report;
};

window.runVedicRuleEngine = (query, profile, kundli, targetDate) => {
  const lQ = query.toLowerCase();
  if (lQ.includes("yearly horoscope") || lQ.includes("month-by-month")) {
    return window.generateOfflineYearlyHoroscope(profile, kundli, targetDate);
  }
  const dateFormatted = targetDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  const b = window.bio(profile?.dob, targetDate, profile?.utcOffset);
  const pK = window.WEEKDAY[targetDate.getDay()];
  const rulingPlanet = { Sun: "Sun", Mon: "Moon", Tue: "Mars", Wed: "Mercury", Thu: "Jupiter", Fri: "Venus", Sat: "Saturn" }[pK] || "Sun";

  const lagna = kundli.d1.lagna;
  const moonSign = kundli.moonSign;
  const nak = kundli.nak;
  const pada = kundli.pada;
  const jupDeg = kundli.planetaryDegrees.Jupiter.toFixed(2);
  const satDeg = kundli.planetaryDegrees.Saturn.toFixed(2);
  const moonDeg = kundli.planetaryDegrees.Moon.toFixed(2);

  const currentDecYear = targetDate.getFullYear() + (targetDate.getMonth() / 12) + (targetDate.getDate() / 365);
  const mahaObj = kundli.dasha.find((d) => currentDecYear >= d.start && currentDecYear < d.end);
  const activeMaha = mahaObj ? mahaObj.lord : "Jupiter";
  let activeAntar = activeMaha;
  if (mahaObj) {
    const antarList = window.getAntardashas(activeMaha, mahaObj.start, mahaObj.end);
    activeAntar = antarList.find((a) => currentDecYear >= a.start && currentDecYear < a.end)?.lord || activeMaha;
  }

  let domain = "Holistic Jyotish & Gochara Synthesis";
  let analysis = "";
  let roadmap = "";
  let muhurtaRemedy = "";

  if (lQ.includes("target") || lQ.includes("commission") || lQ.includes("career")) {
    domain = "Career Milestones & Revenue Achievement";
    analysis = `• Real-Time Transit Matrix: Jupiter transits ${kundli.transits.Jupiter} (${jupDeg}°), Saturn transits ${kundli.transits.Saturn} (${satDeg}°).\n• Active Vimshottari Cycle: ${activeMaha} Mahadasha / ${activeAntar} Antardasha governing key house axes.\n• Cognitive Resonance: Intellectual biorhythm wave is calculated at ${Math.round(((b.i + 1) / 2) * 100)}%, indicating high bandwidth for complex negotiations.`;
    roadmap = `1. Target Alignment: Execute formal contract milestones during your ruling ${pK} Horas and Abhijit Muhurta.\n2. Negotiation Vector: Anchor multi-party deliverables with verifiable data to satisfy Saturnian rigor.`;
    muhurtaRemedy = `Chant "${window.PLANET_INFO[activeMaha]?.beej}" and align with ${window.PLANET_INFO[activeMaha]?.gem} for sustained career momentum.`;
  } else {
    domain = "Comprehensive Vedic Life Guidance";
    analysis = `• Native: ${profile?.name || "Native"} | Target Date: ${dateFormatted}\n• Core Matrix: ${lagna} Lagna, Moon at ${moonDeg}° in ${nak} (Pada ${pada}).\n• Current Cosmic Rulers: ${activeMaha} Mahadasha is guiding your overarching karmic trajectory, with day energy governed by ${rulingPlanet}.`;
    roadmap = `1. Decisions: Align high-value tasks with favorable Choghadiya windows (Amrit, Shubh, Labh) visible in your Panchang tab.\n2. Energy: Maintain balanced output tailored to your biorhythms (P: ${Math.round(((b.p + 1) / 2) * 100)}%, E: ${Math.round(((b.e + 1) / 2) * 100)}%, I: ${Math.round(((b.i + 1) / 2) * 100)}%).`;
    muhurtaRemedy = `Recite the Beej Mantra for the active Hora ruler (${rulingPlanet}): "${window.PLANET_INFO[rulingPlanet]?.beej}".`;
  }

  return `[Graha Ledger Vedic Expert Engine — Deterministic Mode]\n═════════════════════════════════════════════════════\n📍 DOMAIN: ${domain}\n\n1. DATA-DRIVEN VEDIC SYNTHESIS:\n${analysis}\n\n2. PRESCRIBED ACTION ROADMAP:\n${roadmap}\n\n3. DIVINE REMEDY & MANTRAS:\n• ${muhurtaRemedy}\n• Daily Action: ${window.PLANET_INFO[rulingPlanet]?.action}`;
};

window.generateDeepSynthesis = (pr, ch, bio, targetDate) => {
  if (!ch || !ch.d1) return {};
  const lagna = ch.d1.lagna; const lagnaLord = window.SIGN_LORDS[lagna]; const moon = ch.moonSign; 
  const sortedPower = Object.entries(ch.shadbala || {}).sort((a, b) => b[1] - a[1]);
  const topPlanet = sortedPower[0]?.[0] || lagnaLord; const weakPlanet = sortedPower[sortedPower.length - 1]?.[0] || "Saturn";
  
  // Calculate specific Mahadasha and Antardasha
  const tD = targetDate || new Date();
  const currentDecYear = tD.getFullYear() + (tD.getMonth() / 12) + (tD.getDate() / 365);
  const mahaObj = ch.dasha?.find((d) => currentDecYear >= d.start && currentDecYear < d.end);
  const activeMaha = mahaObj ? mahaObj.lord : "Sun";
  let activeAntar = activeMaha;
  if (mahaObj && window.getAntardashas) { activeAntar = window.getAntardashas(activeMaha, mahaObj.start, mahaObj.end).find((a) => currentDecYear >= a.start && currentDecYear < a.end)?.lord || activeMaha; }

  const bioP = Math.round(((bio.p + 1) / 2) * 100); const bioE = Math.round(((bio.e + 1) / 2) * 100); const bioI = Math.round(((bio.i + 1) / 2) * 100);
  const bioRaw = { p: Math.round(bio.p * 100), e: Math.round(bio.e * 100), i: Math.round(bio.i * 100), s: Math.round(bio.s * 100) };
  const bioNarrative = [
    `Physical: ${window.getBiorhythmInterpretation("Physical", bio.p, true)} (${bioRaw.p}% raw / ${bioP}% normalized).`,
    `Emotional: ${window.getBiorhythmInterpretation("Emotional", bio.e, true)} (${bioRaw.e}% raw / ${bioE}% normalized).`,
    `Intellectual: ${window.getBiorhythmInterpretation("Intellectual", bio.i, true)} (${bioRaw.i}% raw / ${bioI}% normalized).`,
    `Spiritual: ${window.getBiorhythmInterpretation("Spiritual", bio.s, true)} (${bioRaw.s}% raw / ${Math.round(((bio.s + 1) / 2) * 100)}% normalized).`
  ].join(" ");
  const chartPositionSummary = Object.entries(ch.d1.signs || {}).map(([planet, sign]) => `${planet} in ${sign}`).join(", ");
  const profileIdentity = `${pr?.name || "this native"} from ${pr?.place || "your selected place"}${pr?.gotra ? ` of ${pr.gotra} gotra` : ""}${pr?.jaati ? ` (${pr.jaati})` : ""}`;
  const lagnaHouseMeaning = `${pr?.name || "Your"} ${lagna} Lagna is the starting point of the twelve-house chart. It describes your approach to life, body, identity, and the way other people first experience you. In ${profileIdentity}, the ${lagna} Ascendant creates a rhythm where ${window.SIGN_TRAITS?.[lagna] || 'clarity and momentum'} matters most. Its ruler is ${lagnaLord}, so qualities of ${window.PLANET_INFO[lagnaLord]?.adhidevata || lagnaLord} become a central theme for confidence, purpose, and direction.`;
  const chalitMeaning = `Your Chalit-style chart keeps the same ${lagna} Ascendant but reads the house results through a more practical lens for ${pr?.name || "you"}. In this view, ${Object.entries(ch.d1.placements || {}).map(([planet, house]) => `${planet} sits in house ${house}`).join(", ")}. In plain language, a house tells you where the influence is experienced: the 1st is self, 2nd resources and speech, 3rd effort, 4th home, 5th learning and creativity, 6th work and health routines, 7th partnership, 8th change, 9th learning and belief, 10th career, 11th gains, and 12th rest and release.`;
  const shadbalaMeaning = `${pr?.name || "You"}'s Shadbala scores compare the relative operating strength of the seven classical planets in this chart. ${topPlanet} leads at ${(ch.shadbala?.[topPlanet] / 60 || 0).toFixed(1)} Rupas, making its themes easier to activate; ${weakPlanet} is lowest at ${(ch.shadbala?.[weakPlanet] / 60 || 0).toFixed(1)} Rupas, so that area needs planning, patience, and repetition. This is a relative strength guide, not a promise that one planet controls your entire life.`;
  const gocharaMeaning = `For ${pr?.name || "you"} on ${tD.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}, current transits are read against your ${lagna} Ascendant and ${moon} Moon in ${pr?.place || "your profile location"}. ${Object.entries(ch.transits || {}).map(([planet, sign]) => `${planet} is moving through ${sign}`).join(", ")}. These are timing indicators for your current environment; they describe the atmosphere around your natal potential, not a replacement for your birth chart.`;
  const monthlyMeaning = `This twelve-month matrix is tailored to ${pr?.name || "your"} ${lagna} Ascendant, ${moon} Moon, active ${activeMaha} Mahadasha, and the strongest influence of ${topPlanet}. Each month translates those chart factors into practical themes for work, money, home, and wellbeing in ${pr?.place || "your chosen location"}.`;

  // Deep Jaimini Meanings
  const karakaMeanings = {
    "Atma Karaka (AK)": "The 'King' of your chart. It represents your soul's deepest desires, ultimate karmic lessons, and the core purpose of your current incarnation.",
    "Amatya Karaka (AmK)": "The 'Minister'. It dictates your career trajectory, professional inclinations, and the means through which you acquire wealth and status.",
    "Bhratru Karaka (BK)": "Represents mentors, gurus, siblings, and those who guide you through adversity.",
    "Matru Karaka (MK)": "Represents maternal figures, your internal happiness, psychological foundation, and properties.",
    "Putra Karaka (PK)": "Governs creative intelligence, children, speculative investments, and educational pursuits.",
    "Gnati Karaka (GK)": "The indicator of obstacles, debts, competitive rivals, and karmic struggles that you must overcome.",
    "Dara Karaka (DK)": "The indicator of your spouse, long-term romantic partners, and significant business partnerships."
  };

  // Deep Avastha Meanings
  const avasthaMeanings = {
    "Bala (Infant)": "Operating at 25% capacity. Gentle, raw, but lacks the maturity to deliver independent, forceful results.",
    "Kumara (Adolescent)": "Operating at 50% capacity. Eager and learning, bringing active but sometimes unrefined energy to its domain.",
    "Yuva (Youth)": "Operating at 100% capacity! The planet is highly potent, commanding, and delivers its promises with absolute certainty.",
    "Vriddha (Old)": "Operating at 10% capacity. Represents wisdom but lacks the physical stamina to manifest material results efficiently.",
    "Mrita (Dead)": "Operating at 0% capacity. The planet's energy is entirely dormant, demanding heavy remediation and conscious effort to activate."
  };

  const antarTraits = {
    Sun: "authority, visibility, ego, and governmental matters", Moon: "emotional shifts, maternal energy, and public perception",
    Mars: "raw conflict, physical energy, courage, and real estate", Mercury: "commerce, high-speed communication, and technical analysis",
    Jupiter: "expansion, financial windfalls, wisdom, and philosophical growth", Venus: "romantic partnerships, luxuries, vehicle acquisitions, and diplomacy",
    Saturn: "delays, intense structural discipline, heavy workloads, and karmic reckoning", Rahu: "sudden foreign events, intense obsessions, and technological breakthroughs",
    Ketu: "detachment, spiritual clearing, sudden endings, and mystical insights"
  };

  return {
    basicKundali: `${pr?.name || "Your"} chart is anchored by the ${lagna} Ascendant, ruled by ${lagnaLord}. This geometry shapes the outward style of ${pr?.name || "the native"} and at a practical level makes you naturally ${window.SIGN_TRAITS?.[lagna] || 'driven and distinct'}. With your Moon in ${moon}, your emotional life seeks security through ${window.SIGN_TRAITS?.[moon] || 'structured stability'}; this gives your inner rhythm a clear, more personal pattern.` ,
    basicDasha: `${pr?.name || "You"} are currently experiencing the overarching Mahadasha of ${activeMaha}, which pulls your primary focus toward its natal promises. However, your immediate daily reality is currently shaped by the sub-cycle of ${activeAntar}, triggering themes of ${antarTraits[activeAntar]}. This is the timing window most likely to feel active and visible in your practical life.` ,
    basicPower: `Shadbala reveals that ${topPlanet} is your strongest operating force, while ${weakPlanet} is your key developmental pressure point. For ${pr?.name || "this native"}, the best advantage comes from using ${topPlanet} consciously while strengthening ${weakPlanet} through structure, patience, and deliberate practice.`,
    basicBio: `For ${pr?.name || "this native"} on ${tD.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}, the raw values are P ${bioRaw.p}%, E ${bioRaw.e}%, I ${bioRaw.i}%, S ${bioRaw.s}%. The app normalizes these into a clearer 0–100 reading for daily use: P ${bioP}%, E ${bioE}%, I ${bioI}%, S ${Math.round(((bio.s + 1) / 2) * 100)}%. ${bioNarrative}`,
    lagnaMeaning: lagnaHouseMeaning,
    chalitMeaning,
    shadbalaMeaning,
    gocharaMeaning,
    monthlyMeaning,
    dynamicPrescription: { gem: window.PLANET_INFO[lagnaLord]?.gem, charity: window.PLANET_INFO[weakPlanet]?.charity, mantra: window.PLANET_INFO[activeAntar]?.beej, deity: window.PLANET_INFO[lagnaLord]?.adhidevata, action: `Fortify your weakest link (${weakPlanet}) by observing its specific discipline, while ruthlessly leveraging your dominant ${topPlanet} for major decisions.` },
    
    // PDF SPECIFIC GENERATORS
    pdfShadbala: `Shadbala calculates the exact mathematical "weight" of each planet in your chart. Your highest scoring planet is ${topPlanet}. You have a natural advantage in areas governed by it. Conversely, your lowest scoring planet is ${weakPlanet}, indicating your primary karmic bottleneck where you must apply conscious effort.`,
    pdfBiorhythm: `Biorhythms mathematically map your 30-day internal energy fluctuations. Today, your Physical stamina is ${bioP}%, Emotional stability is ${bioE}%, and Intellectual focus is ${bioI}%. Execute heavy analytical tasks when Intellectual peaks, and prioritize rest when Physical dips.`,
    pdfDasha: `Vimshottari Dasha is the Vedic timeline of your life. While your main cycle is ${activeMaha}, your current sub-cycle (Antardasha) is ruled by ${activeAntar}. This means the immediate focus of your life is drawn toward ${antarTraits[activeAntar]}. To make the absolute best use of this phase, lean entirely into the behavioral traits of ${activeAntar} rather than fighting its natural current.`,
    advLedger: `For ${pr?.name || "this native"}, the ${lagna} Ascendant describes your outward approach to life and your ${moon} Moon describes your emotional habits. Your chart places ${chartPositionSummary}. ${topPlanet} is your strongest planetary channel, so its themes are easier for you to express; ${weakPlanet} is the area that benefits most from patience and deliberate practice. In the ledger, the planet identifies a life function, its Rashi shows the style in which that function operates, the degree marks its exact position, and the nakshatra adds a finer psychological pattern. In practical terms, use strong planets as existing strengths and develop weaker planets as skills rather than treating them as fixed limitations.`,
    karakaMeanings,
    avasthaMeanings
  };
};
