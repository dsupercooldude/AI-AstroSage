const fs = require('fs');
let ai = fs.readFileSync('src/js/ai-rules.js', 'utf8');

const callPollinations = `
const callPollinations = async () => {
  const encP = encodeURIComponent(combinedPrompt);
  const res = await fetch(\`https://text.pollinations.ai/\${encP}\`);
  if (!res.ok) throw new Error(\`Pollinations HTTP \${res.status}\`);
  return await res.text();
};
`;

ai = ai.replace('const callHuggingFace', callPollinations + '\nconst callHuggingFace');

ai = ai.replace(
  '{ id: "huggingface", fn: callHuggingFace, key: keys.huggingface }',
  '{ id: "huggingface", fn: callHuggingFace, key: keys.huggingface },\n    { id: "free-ai", fn: callPollinations, key: "free" }'
);

ai = ai.replace(
  'const availableProviders = providers.filter((prov) => prov.key);',
  'const availableProviders = providers.filter((prov) => prov.key || prov.id === "free-ai");'
);

const offlineLearning = `
window.updateOfflineRules = (userMsg, aiMsg) => {
    try {
        let rules = JSON.parse(localStorage.getItem('gl_offline_learned_rules') || '[]');
        // simple keyword extraction to "learn"
        if (userMsg.toLowerCase().includes('career')) rules.push("User prioritizes career questions.");
        if (userMsg.toLowerCase().includes('health')) rules.push("User focuses on health analysis.");
        if (userMsg.toLowerCase().includes('marriage')) rules.push("User focuses on marriage and relationships.");
        // keep unique and last 10
        rules = [...new Set(rules)].slice(-10);
        localStorage.setItem('gl_offline_learned_rules', JSON.stringify(rules));
    } catch(e) {}
};

window.getOfflineRules = () => {
    try {
        return JSON.parse(localStorage.getItem('gl_offline_learned_rules') || '[]');
    } catch(e) { return []; }
};
`;

ai = ai.replace(
  'window.runVedicRuleEngine = (query, profile, kundli, targetDate, learnedContext = "") => {',
  offlineLearning + '\nwindow.runVedicRuleEngine = (query, profile, kundli, targetDate, learnedContext = "", chineseWall = false) => {\n  const rules = window.getOfflineRules().join(" | ");'
);

ai = ai.replace(
  'let analysis = `**Native:** ${profile?.name || "Native"} | **Target Date:** ${dateFormatted}\\n**Core Matrix:** ${kundli.d1.lagna} Lagna, Moon in ${kundli.nak} (Pada ${kundli.pada}).\\n**Current Cosmic Rulers:** ${activeMaha} Mahadasha is guiding your overarching karmic trajectory, with day energy governed by ${rulingPlanet}.${learnedContext ? `\\n**Learned conversation context:** ${learnedContext}` : ""}`;',
  'let analysis = chineseWall ? `**Target Date:** ${dateFormatted}\\n(Profile context shielded due to Chinese Wall privacy settings).\\n**Learned AI Rules:** ${rules}\\n${learnedContext ? `**Recent context:** ${learnedContext}` : ""}` : `**Native:** ${profile?.name || "Native"} | **Target Date:** ${dateFormatted}\\n**Core Matrix:** ${kundli.d1.lagna} Lagna, Moon in ${kundli.nak} (Pada ${kundli.pada}).\\n**Current Cosmic Rulers:** ${activeMaha} Mahadasha is guiding your overarching karmic trajectory, with day energy governed by ${rulingPlanet}.${learnedContext ? `\\n**Learned conversation context:** ${learnedContext}` : ""}\\n**Learned AI Rules:** ${rules}`;'
);

fs.writeFileSync('src/js/ai-rules.js', ai);
