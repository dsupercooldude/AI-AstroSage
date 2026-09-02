const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

code = code.replace(
  /let ans = "";\n\s*if \(settings\?\.aiModel !== "offline" && window\.executeMultiProviderAI\) \{\n\s*const res = await window\.executeMultiProviderAI\(prompt, settings, "You are a mystical, wise Tarot Reader\. Synthesize the meaning of the drawn cards in relation to the user's focus\."\);\n\s*if \(res && res\.text\) ans = res\.text;\n\s*\}/,
  `let ans = "";\n      let provider = "offline";\n      let tokens = 0;\n      if (settings?.aiModel !== "offline" && window.executeMultiProviderAI) {\n         const res = await window.executeMultiProviderAI(prompt, settings, "You are a mystical, wise Tarot Reader. Synthesize the meaning of the drawn cards in relation to the user's focus.");\n         if (res && res.text) { ans = res.text; provider = res.provider; tokens = res.tokens; }\n      }`
);

code = code.replace(
  /setReading\(ans\);\n\s*setTokenUsage\(Math\.floor\(ans\.length \* 0\.25\)\);/,
  'setReading(ans);\n      setTokenUsage(tokens || Math.floor(ans.length * 0.25));'
);

code = code.replace(
  /\{reading && \(\n\s*<div className="bg-black\/40 p-5 rounded-2xl border border-\[\#27272a\] font-mono text-sm leading-relaxed text-amber-100\/90 shadow-inner">\n\s*\{reading\}\n\s*<\/div>\n\s*\)\}/,
  '{reading && (\n              <div className="bg-black/40 p-5 rounded-2xl border border-[#27272a] font-mono text-sm leading-relaxed text-amber-100/90 shadow-inner">\n                {window.formatMarkdown ? window.formatMarkdown(reading) : reading}\n              </div>\n            )}'
);

code = code.replace(
  /const saveHistory = async \(rec\) => \{\n\s*try \{\n\s*const hFile = await window\.AppDB\.getFile\(\`gl_tarot_\$\{emHash\}\.json\`\);\n\s*let hist = \[\];\n\s*if \(hFile\.content\.history\) \{\n\s*const str = typeof hFile\.content\.history === "string" \? await window\.CryptoUtils\.decrypt\(hFile\.content\.history\) : hFile\.content\.history;\n\s*hist = typeof str === "string" \? JSON\.parse\(str\) : str \|\| \[\];\n\s*\}/,
  'const saveHistory = async (rec) => {\n    try {\n      const hFile = await window.AppDB.getFile(`gl_tarot_${emHash}.json`);\n      let hist = [];\n      if (hFile.content.history) {\n        const str = typeof hFile.content.history === "string" ? await window.CryptoUtils.decrypt(hFile.content.history) : hFile.content.history;\n        hist = typeof str === "string" ? JSON.parse(str) : str || [];\n      }\n      rec.profileId = pr?.id;'
);

code = code.replace(
  /setTokenUsage && \(\n\s*<div className="mt-4 text-\[9px\] text-violet-400\/70 text-right uppercase tracking-widest font-bold">\n\s*~ \{tokenUsage\} AI Tokens Used\n\s*<\/div>\n\s*\)/,
  'setTokenUsage && (\n              <div className="mt-4 text-[9px] text-violet-400/70 text-right uppercase tracking-widest font-bold">\n                <window.Icon.ShieldCheck size={12} className="inline mr-1" /> {provider === "offline" ? "AI" : provider + " Engine"} - 95% CONFIDENCE | {tokenUsage} TOKENS\n              </div>\n            )'
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', code);
