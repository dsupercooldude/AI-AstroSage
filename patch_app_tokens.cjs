const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

const tokenListener = `
  useEffect(() => {
    const handleTokenUsage = async (e) => {
      if (!u || !u.emailHash) return;
      try {
        const { engine, tokens } = e.detail;
        let authFile = await window.AppDB.getFile('gl_auth.json');
        if (!authFile.content.users[u.emailHash].settings) authFile.content.users[u.emailHash].settings = {};
        if (!authFile.content.users[u.emailHash].settings.tokenUsage) authFile.content.users[u.emailHash].settings.tokenUsage = {};
        const cur = authFile.content.users[u.emailHash].settings.tokenUsage[engine] || 0;
        authFile.content.users[u.emailHash].settings.tokenUsage[engine] = cur + tokens;
        await window.AppDB.saveFile('gl_auth.json', authFile.content, authFile.sha);
        // Also update local state so SettingsModal reflects it
        setU(prev => {
           const next = {...prev};
           if (!next.settings) next.settings = {};
           if (!next.settings.tokenUsage) next.settings.tokenUsage = {};
           next.settings.tokenUsage[engine] = (next.settings.tokenUsage[engine] || 0) + tokens;
           return next;
        });
      } catch (err) {
        console.error("Token usage save failed", err);
      }
    };
    window.addEventListener('aiTokenUsage', handleTokenUsage);
    return () => window.removeEventListener('aiTokenUsage', handleTokenUsage);
  }, [u]);
`;

// Insert after const [ss, setSs] = useState(false);
code = code.replace(/const \[ss, setSs\] = useState\(false\);/, 
  'const [ss, setSs] = useState(false);\n' + tokenListener);

fs.writeFileSync('src/jsx/app.jsx', code);
