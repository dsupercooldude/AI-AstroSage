const fs = require('fs');

const code = `
window.TarotTab = () => {
  const { useState, useEffect } = window.React;
  const { Icon } = window;
  const [deckMajor, setDeckMajor] = useState([]);
  const [deckMinor, setDeckMinor] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedMinor, setSelectedMinor] = useState(null);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [tokenUsage, setTokenUsage] = useState(null);

  useEffect(() => {
    const suits = ["Wands", "Cups", "Swords", "Pentacles"];
    const court = ["Page", "Knight", "Queen", "King"];
    const majorArcana = [
      "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
      "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
      "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
      "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
      "Judgement", "The World"
    ];
    let major = [];
    let minor = [];
    majorArcana.forEach(name => major.push({ name, type: "Major", suit: null }));
    suits.forEach(suit => {
      for (let i = 1; i <= 10; i++) {
        minor.push({ name: \`\${i === 1 ? 'Ace' : i} of \${suit}\`, type: "Minor", suit });
      }
      court.forEach(rank => {
        minor.push({ name: \`\${rank} of \${suit}\`, type: "Minor", suit });
      });
    });
    // Shuffle visually
    setDeckMajor(major.sort(() => Math.random() - 0.5));
    setDeckMinor(minor.sort(() => Math.random() - 0.5));
  }, []);

  const getReading = async () => {
    if (!selectedMajor || !selectedMinor || isDrawing) return;
    setIsDrawing(true);
    setReading("");
    setTokenUsage(null);
    try {
      const q = question.trim() || "What do I need to know right now?";
      const prompt = \`The user has asked the Tarot oracle: "\${q}". They drew the Major Arcana "\${selectedMajor.name}" (\${selectedMajor.reversed ? 'Reversed' : 'Upright'}) and the Minor Arcana "\${selectedMinor.name}" (\${selectedMinor.reversed ? 'Reversed' : 'Upright'}). Provide a deep, poetic, yet highly practical 2-paragraph Tarot reading combining these archetypes.\`;
      
      const res = await window.queryAI(prompt, "auto");
      if (res && res.text) {
        setReading(res.text);
        setTokenUsage(Math.floor(res.text.length * 0.3));
      } else {
        setReading("The spirits are quiet. The AI engine could not connect.");
      }
    } catch (e) {
      setReading("Connection to the Oracle failed.");
    }
    setIsDrawing(false);
  };

  const drawRandom = (deck, setSel) => {
    const card = deck[Math.floor(Math.random() * deck.length)];
    setSel({ ...card, reversed: Math.random() > 0.5 });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 gl-fadein pb-20">
      <div className="bgcard rounded-3xl border border-indigo-500/30 p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"></div>
        <div className="absolute -right-10 -top-10 text-indigo-500/10"><Icon name="cards" size={180} weight="fill" /></div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] uppercase tracking-widest font-bold border border-indigo-500/30">AI Oracle Engine</span>
          </div>
          <h2 className="font-serif text-2xl text-indigo-100 mt-1">Tarot Divination</h2>
          <p className="text-[11px] font-mono text-indigo-200/70 mt-2 max-w-2xl leading-relaxed">
            Concentrate on your query. Draw 1 Major Arcana (Core Theme) and 1 Minor Arcana (Practical Application) for a highly specific AI-powered reading.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bgcard p-5 shadow-xl">
        <div className="flex gap-2 mb-6">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Focus your intention and type a question..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/50 text-white font-mono placeholder:text-white/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Major Arcana Selection */}
          <div className="flex flex-col items-center">
            <h3 className="font-serif text-indigo-300 mb-3">Major Arcana</h3>
            {!selectedMajor ? (
              <div 
                className="w-32 h-48 rounded-xl border border-indigo-500/40 bg-gradient-to-br from-indigo-900/40 to-black cursor-pointer hover:scale-105 transition shadow-lg shadow-indigo-500/20 flex items-center justify-center relative overflow-hidden group"
                onClick={() => drawRandom(deckMajor, setSelectedMajor)}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiM0ZjQ2ZTUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50"></div>
                <Icon name="sparkle" size={24} className="text-indigo-500/50 group-hover:text-indigo-400 transition" />
                <span className="absolute bottom-4 text-[9px] font-mono text-indigo-400/70 uppercase tracking-widest">Draw</span>
              </div>
            ) : (
              <div 
                onClick={() => setSelectedMajor(null)}
                className="w-32 h-48 rounded-xl border border-indigo-400 bg-indigo-900/30 cursor-pointer hover:border-red-500/50 transition flex flex-col items-center justify-center p-3 text-center shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                <Icon name="star" weight="duotone" size={28} className={\`text-indigo-300 mb-2 \${selectedMajor.reversed ? 'rotate-180 opacity-70' : ''}\`} />
                <span className="font-serif text-sm text-indigo-100">{selectedMajor.name}</span>
                <span className="text-[9px] font-mono text-indigo-300/70 uppercase mt-1 tracking-wider">{selectedMajor.reversed ? 'Reversed' : 'Upright'}</span>
              </div>
            )}
          </div>

          {/* Minor Arcana Selection */}
          <div className="flex flex-col items-center">
            <h3 className="font-serif text-pink-300 mb-3">Minor Arcana</h3>
            {!selectedMinor ? (
              <div 
                className="w-32 h-48 rounded-xl border border-pink-500/40 bg-gradient-to-br from-pink-900/40 to-black cursor-pointer hover:scale-105 transition shadow-lg shadow-pink-500/20 flex items-center justify-center relative overflow-hidden group"
                onClick={() => drawRandom(deckMinor, setSelectedMinor)}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNlYzQ4OTkiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50"></div>
                <Icon name="diamonds-four" size={24} className="text-pink-500/50 group-hover:text-pink-400 transition" />
                <span className="absolute bottom-4 text-[9px] font-mono text-pink-400/70 uppercase tracking-widest">Draw</span>
              </div>
            ) : (
              <div 
                onClick={() => setSelectedMinor(null)}
                className="w-32 h-48 rounded-xl border border-pink-400 bg-pink-900/30 cursor-pointer hover:border-red-500/50 transition flex flex-col items-center justify-center p-3 text-center shadow-[0_0_15px_rgba(236,72,153,0.2)]"
              >
                <Icon name="diamonds-four" weight="duotone" size={28} className={\`text-pink-300 mb-2 \${selectedMinor.reversed ? 'rotate-180 opacity-70' : ''}\`} />
                <span className="font-serif text-sm text-pink-100">{selectedMinor.name}</span>
                <span className="text-[9px] font-mono text-pink-300/70 uppercase mt-1 tracking-wider">{selectedMinor.reversed ? 'Reversed' : 'Upright'}</span>
              </div>
            )}
          </div>

        </div>

        <div className="flex justify-center mb-6">
          <button 
            onClick={getReading}
            disabled={!selectedMajor || !selectedMinor || isDrawing}
            className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/40 disabled:text-white/30 text-white font-bold transition flex items-center justify-center shadow-lg shadow-indigo-900/50"
          >
            {isDrawing ? <Icon name="spinner" className="animate-spin mr-2" size={18} /> : null}
            {isDrawing ? 'Channeling Oracle...' : 'Read My Cards'}
          </button>
        </div>

        {reading && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein relative">
            <h3 className="font-serif text-lg text-indigo-200 mb-4 flex items-center gap-2">
              <Icon name="sparkle" /> Oracle Synthesis
            </h3>
            <div className="whitespace-pre-line text-sm font-mono leading-relaxed text-indigo-100/80">
              {reading}
            </div>
            {tokenUsage && (
              <div className="mt-4 text-[9px] text-indigo-400/50 border-t border-indigo-500/20 pt-2 text-right">
                 ~ {tokenUsage} AI Tokens Consumed
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/jsx/tab-tarot.jsx', code);
