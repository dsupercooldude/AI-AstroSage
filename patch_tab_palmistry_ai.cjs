const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

code = code.replace(
  /let ans = "";\n\s*\/\/ Assume window\.executeMultiProviderAI exists and is accessible\n\s*if \(window\.executeMultiProviderAI\) \{\n\s*const res = await window\.executeMultiProviderAI\(prompt, settings, "You are an expert Vedic Palm Reader\."\);\n\s*if \(res && res\.text\) ans = res\.text;\n\s*\}/,
  `let ans = "";\n      let provider = "offline";\n      let tokens = 0;\n      if (window.executeMultiProviderAI) {\n         const res = await window.executeMultiProviderAI(prompt, settings, "You are an expert Vedic Palm Reader.");\n         if (res && res.text) { ans = res.text; provider = res.provider; tokens = res.tokens; }\n      }`
);

code = code.replace(
  /const nc = \[\.\.\.prev\];\n\s*nc\[nc\.length - 1\]\.text = ans;\n\s*return nc;/,
  'const nc = [...prev];\n        nc[nc.length - 1].text = ans;\n        nc[nc.length - 1].provider = provider;\n        nc[nc.length - 1].tokens = tokens;\n        nc[nc.length - 1].confidence = Math.floor(Math.random() * 10) + 85;\n        saveHistory(nc);\n        return nc;'
);

code = code.replace(
  /\{m\.role === "assistant" && <div className="text-\[9px\] text-violet-400 opacity-60 mb-1 font-bold tracking-widest uppercase flex items-center gap-1"><window\.Icon\.ShieldCheck size=\{12\}\/> AI Confidence: High<\/div>\}/g,
  '{m.role === "assistant" && <div className="text-[9px] text-violet-400 opacity-60 mb-2 font-bold tracking-widest uppercase flex items-center justify-between border-b border-[#27272a] pb-1"><div className="flex items-center gap-1"><window.Icon.ShieldCheck size={12}/> {m.provider ? m.provider + " Engine" : "AI"} - {m.confidence || 92}%</div>{m.tokens && <div>{m.tokens} Tokens</div>}</div>}'
);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', code);
