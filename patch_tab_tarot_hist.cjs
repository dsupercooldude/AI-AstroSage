const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

code = code.replace(
  /const getReading = async \(\) => \{/,
  `const getReading = async () => {`
);

code = code.replace(
  /setTokenUsage\(tokens \|\| Math\.floor\(ans\.length \* 0\.25\)\);\n\s*setAiProvider\(provider\);\n\s*\} catch \(e\)/,
  `setTokenUsage(tokens || Math.floor(ans.length * 0.25));
      setAiProvider(provider);
      
      try {
        const hFile = await window.AppDB.getFile(\`gl_tarot_\${emHash}.json\`);
        let hist = [];
        if (hFile.content.history) {
          const str = typeof hFile.content.history === "string" ? await window.CryptoUtils.decrypt(hFile.content.history) : hFile.content.history;
          hist = typeof str === "string" ? JSON.parse(str) : str || [];
        }
        hist.push({ ts: Date.now(), question: q, reading: ans, cards: [selectedMajor, selectedMinor], profileId: window.activeProfileId || "" });
        hFile.content.history = await window.CryptoUtils.encrypt(hist);
        await window.AppDB.saveFile(\`gl_tarot_\${emHash}.json\`, hFile.content, hFile.sha);
      } catch(e) {}
    } catch (e)`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', code);
