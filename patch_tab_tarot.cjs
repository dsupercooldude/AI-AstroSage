const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

c = c.replace(
  /const \[selectedMinor, setSelectedMinor\] = useState\(null\);/,
  `const [selectedMinor, setSelectedMinor] = useState(null);
  
  useEffect(() => {
    // Load Tarot of the day
    window.VaultHistoryService.getLogs("tarot", emHash, pr?.id || "default").then(logs => {
       if (logs && logs.length > 0) {
          const lastLog = logs[logs.length - 1];
          if (lastLog.ts) {
             const logDate = new Date(lastLog.ts).toDateString();
             const today = new Date().toDateString();
             if (logDate === today && lastLog.cards && lastLog.cards.length === 2) {
                setQuestion(lastLog.question || "");
                setSelectedMajor(lastLog.cards[0]);
                setSelectedMinor(lastLog.cards[1]);
                setReading(lastLog.reading || lastLog.analysis || lastLog.text);
             }
          }
       }
    });
  }, [emHash, pr?.id]);`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
