const fs = require('fs');
let c = fs.readFileSync('src/js/ai-rules.js', 'utf8');

const targetCursor = `  const cursorKey = "gl_ai_provider_cursor";
  let cursor = 0;
  try { cursor = Number.parseInt(localStorage.getItem(cursorKey) || "0", 10) || 0; } catch (e) {}
  
  const rotatedProviders = availableProviders.length ? availableProviders.map((_, index) => availableProviders[(cursor + index) % availableProviders.length]) : [];
  
  for (const prov of rotatedProviders) {
      try {
        const txt = await prov.fn(prov.key);
        if (txt) {
          try { localStorage.setItem(cursorKey, String((providers.findIndex((item) => item.id === prov.id) + 1) % providers.length)); } catch (e) {}`;

const replaceCursor = `  const cursorKey = "gl_ai_provider_cursor";
  let cursor = 0;
  try { cursor = Number.parseInt(localStorage.getItem(cursorKey) || "0", 10) || 0; } catch (e) {}
  
  const rotatedProviders = availableProviders.length ? availableProviders.map((_, index) => availableProviders[(cursor + index) % availableProviders.length]) : [];
  
  for (const prov of rotatedProviders) {
      try {
        const txt = await prov.fn(prov.key);
        if (txt) {
          try { localStorage.setItem(cursorKey, String((availableProviders.findIndex((item) => item.id === prov.id) + 1) % availableProviders.length)); } catch (e) {}`;

c = c.replace(targetCursor, replaceCursor);
fs.writeFileSync('src/js/ai-rules.js', c);
