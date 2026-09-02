const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

// Update props
code = code.replace(/window\.TarotTab = \(\{ settings \}\) => \{/, 'window.TarotTab = ({ settings, emHash }) => {');

// Add history hooks
const historyHooks = `
  const [reading, setReading] = useState(null);
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const hFile = await window.AppDB.getFile(\`gl_tarot_\${emHash}.json\`);
        const decH = typeof hFile.content.h === "string" ? await window.CryptoUtils.decrypt(hFile.content.h) : hFile.content.h || [];
        if (isMounted && decH) {
          setHistory(decH);
          if (decH.length > 0) setReading(decH[decH.length - 1]);
        }
      } catch (e) {}
    };
    if (emHash) loadHistory();
    return () => { isMounted = false; };
  }, [emHash]);

  const saveHistory = async (newHistory) => {
    try {
      const hFile = await window.AppDB.getFile(\`gl_tarot_\${emHash}.json\`);
      hFile.content.h = await window.CryptoUtils.encrypt(newHistory);
      await window.AppDB.saveFile(\`gl_tarot_\${emHash}.json\`, hFile.content, hFile.sha);
    } catch (e) {}
  };
`;

code = code.replace(/const \[reading, setReading\] = useState\(null\);/, historyHooks);

// Update setReading logic
code = code.replace(/setReading\(newReading\);/, 
`setReading(newReading);
      setHistory(prev => {
        const nx = [...prev, newReading];
        saveHistory(nx);
        return nx;
      });`);

fs.writeFileSync('src/jsx/tab-tarot.jsx', code);
