window.TarotTab = () => {
  const { useState, useEffect } = window.React;
  const { Icon } = window;
  const [deck, setDeck] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize a standard 78-card Rider-Waite-Smith deck
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

    let newDeck = [];
    
    // Add Major Arcana
    majorArcana.forEach(name => newDeck.push({ name, type: "Major", suit: null }));
    
    // Add Minor Arcana
    suits.forEach(suit => {
      for (let i = 1; i <= 10; i++) {
        newDeck.push({ name: `${i === 1 ? 'Ace' : i} of ${suit}`, type: "Minor", suit });
      }
      court.forEach(rank => {
        newDeck.push({ name: `${rank} of ${suit}`, type: "Minor", suit });
      });
    });

    setDeck(newDeck);
  }, []);

  const drawCards = () => {
    if (deck.length === 0 || isDrawing) return;
    setIsDrawing(true);
    setReading("");
    
    // Simulate a shuffle and draw 3 cards (Past, Present, Future)
    let shuffled = [...deck].sort(() => Math.random() - 0.5);
    let selected = shuffled.slice(0, 3).map(card => ({
      ...card,
      reversed: Math.random() > 0.5
    }));

    setTimeout(() => {
      setDrawnCards(selected);
      setIsDrawing(false);
      
      // Auto-generate a basic deterministic reading based on the offline rules concept
      const positions = ["Past Context", "Current Situation", "Future Trajectory"];
      let summary = selected.map((c, i) => {
        const state = c.reversed ? "blocked or internalized" : "flowing and active";
        return `${positions[i]}: ${c.name} (${c.reversed ? 'Reversed' : 'Upright'}) indicates energy that is ${state}.`;
      }).join("\n\n");
      
      setReading(summary);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 gl-fadein pb-20">
      
      <div className="bgcard rounded-3xl border border-indigo-500/30 p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"></div>
        <div className="absolute -right-10 -top-10 text-indigo-500/10"><Icon name="cards" size={180} weight="fill" /></div>
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] uppercase tracking-widest font-bold border border-indigo-500/30">Offline AI Oracle</span>
          </div>
          <h2 className="font-serif text-2xl text-indigo-100 mt-1">Tarot Divination</h2>
          <p className="text-[11px] font-mono text-indigo-200/70 mt-2 max-w-2xl leading-relaxed">
            Concentrate on your query. Draw from the 78-card holographic deck for immediate, deterministic archetypal insights processed entirely on your local machine.
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
          <button 
            onClick={drawCards}
            disabled={isDrawing}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold transition flex items-center justify-center shadow-lg shadow-indigo-900/50"
          >
             {isDrawing ? <Icon name="spinner" className="animate-spin" size={18} /> : 'Draw 3 Cards'}
          </button>
        </div>

        {drawnCards.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {drawnCards.map((card, i) => (
                <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center shadow-inner relative overflow-hidden gl-fadein" style={{ animationDelay: `${i * 200}ms` }}>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 mb-4">
                    {i === 0 ? "1. Past" : i === 1 ? "2. Present" : "3. Future"}
                  </div>
                  <div className={`text-5xl mb-4 text-indigo-300 ${card.reversed ? 'rotate-180 opacity-60' : ''}`}>
                    <Icon name={card.type === 'Major' ? 'star' : 'diamonds-four'} weight="duotone" />
                  </div>
                  <div className="font-serif text-lg text-white mb-1">{card.name}</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                    {card.reversed ? 'Reversed' : 'Upright'}
                  </div>
                </div>
              ))}
            </div>

            {reading && (
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 gl-fadein">
                <h3 className="font-serif text-lg text-indigo-200 mb-4 flex items-center gap-2">
                  <Icon name="sparkle" /> Oracle Synthesis
                </h3>
                <div className="whitespace-pre-line text-sm font-mono leading-relaxed text-indigo-100/80">
                  {reading}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};