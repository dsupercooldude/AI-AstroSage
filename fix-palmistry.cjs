const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

// Update props
code = code.replace(/window\.PalmistryTab = \(\{ pr \}\) => \{/, 'window.PalmistryTab = ({ pr, settings, emHash }) => {');

// Add history states and useEffect
const historyHooks = `
  const [chat, setChat] = useState([
    { role: 'assistant', text: 'This tool is intentionally limited to hand-only analysis. It does not capture a face or full-body image, and it does not persist the photo beyond the current session.' }
  ]);
  
  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {
      try {
        const hFile = await window.AppDB.getFile(\`gl_palmistry_\${emHash}.json\`);
        const decH = typeof hFile.content.h === "string" ? await window.CryptoUtils.decrypt(hFile.content.h) : hFile.content.h || [];
        if (isMounted && decH && decH.length > 0) setChat(decH);
      } catch (e) {}
    };
    if (emHash) loadHistory();
    return () => { isMounted = false; };
  }, [emHash]);

  const saveHistory = async (newChat) => {
    try {
      const hFile = await window.AppDB.getFile(\`gl_palmistry_\${emHash}.json\`);
      hFile.content.h = await window.CryptoUtils.encrypt(newChat);
      await window.AppDB.saveFile(\`gl_palmistry_\${emHash}.json\`, hFile.content, hFile.sha);
    } catch (e) {}
  };
`;

code = code.replace(/const \[chat, setChat\] = useState\(\[\s*\{\s*role: 'assistant',\s*text: 'This tool is intentionally limited to hand-only analysis. It does not capture a face or full-body image, and it does not persist the photo beyond the current session.'\s*\}\s*\]\);/, historyHooks);

// Fix AI Call
code = code.replace(/const res = await window\.executeMultiProviderAI\(prompt, \{\}, "You are an expert Vedic Palm Reader\."\);/, 
'const res = await window.executeMultiProviderAI(prompt, settings, "You are an expert Vedic Palm Reader.");');

// Ensure history is saved on AI reply
code = code.replace(/setChat\(\(prev\) => \[\.\.\.prev, \{ role: 'assistant', text: ans \}\]\);/, 
`setChat((prev) => {
          const nx = [...prev, { role: 'assistant', text: ans }];
          saveHistory(nx);
          return nx;
        });`);
        
code = code.replace(/setChat\(\(prev\) => \[\.\.\.prev, \{ role: 'assistant', text: \`Error: \$\{err\.message\}\` \}\]\);/, 
`setChat((prev) => {
          const nx = [...prev, { role: 'assistant', text: \`Error: \$\{err.message\}\` }];
          saveHistory(nx);
          return nx;
        });`);

code = code.replace(/setChat\(\(prev\) => \[\.\.\.prev, userMsg\]\);/, 
`setChat((prev) => {
        const nx = [...prev, userMsg];
        saveHistory(nx);
        return nx;
      });`);


fs.writeFileSync('src/jsx/tab-palmistry.jsx', code);
