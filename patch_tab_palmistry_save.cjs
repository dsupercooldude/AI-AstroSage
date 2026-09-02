const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

code = code.replace(
  /\/\/ Save to local storage for 7 days\n\s*try \{\n\s*localStorage\.setItem\('gl_palm_cache', JSON\.stringify\(\{/,
  `// Save to local storage for 7 days
    try {
        localStorage.setItem('gl_palm_cache', JSON.stringify({`
);

code = code.replace(
  /timestamp: Date\.now\(\)\n\s*\}\)\);\n\s*\} catch\(e\) \{\}/,
  `timestamp: Date.now()
        }));
        // Also save for PDF
        window.AppDB.getFile(\`gl_palmistry_analysis_\${emHash}.json\`).then(async (f) => {
           let arr = [];
           if (f.content.h) {
              arr = typeof f.content.h === "string" ? await window.CryptoUtils.decrypt(f.content.h) : f.content.h;
           }
           arr.push({ ts: Date.now(), style: styleGuess, analysis: fullAnalysis, profileId: pr?.id });
           f.content.h = await window.CryptoUtils.encrypt(arr);
           await window.AppDB.saveFile(\`gl_palmistry_analysis_\${emHash}.json\`, f.content, f.sha);
        });
    } catch(e) {}`
);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', code);
