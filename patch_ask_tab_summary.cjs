const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

const targetUseEffect = `  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {`;
    
const replacementUseEffect = `  useEffect(() => {
    let isMounted = true;
    const loadSummary = async () => {
      try {
        if (!pr?.id) return;
        const sumFile = await window.AppDB.getFile(\`gl_profile_summary_\${emHash}_\${pr.id}.json\`);
        const sstr = typeof sumFile.content.summary === "string" ? await window.CryptoUtils.decrypt(sumFile.content.summary) : sumFile.content.summary;
        if (isMounted && sstr) setSummary(sstr);
      } catch (e) {}
    };
    loadSummary();
  }, [emHash, pr?.id]);

  useEffect(() => {
    let isMounted = true;
    const loadHistory = async () => {`;

c = c.replace(targetUseEffect, replacementUseEffect);


const targetOnClick = `                onClick={async () => {
                  if (!executeMultiProviderAI) return alert("AI Engine not configured or offline.");
                  setSumL(true);
                  try {
                    const profileChats = h.filter(x => !x.p || x.p === pr?.id);
                    if (profileChats.length === 0) {
                      setSummary("No questions have been asked for this profile yet. Chat with the Sage to build history.");
                      return;
                    }
                    const context = profileChats.map(c => \`Q: \${c.q}\\nA: \${c.a}\`).join("\\n\\n");
                    const res = await executeMultiProviderAI(
                      "Based on the following past questions and astrological interpretations for this person, write a high-level executive summary of their core life themes, challenges, and predicted opportunities. Format with Markdown.\\n\\n" + context,
                      set,
                      "You are an expert Vedic Astrologer synthesizing a client profile."
                    );
                    if (res?.text) {
      setSummary(res.text);
  } else {
      setSummary("Synthesis failed. Errors: " + (window.lastAIProviderErrors ? window.lastAIProviderErrors.join(", ") : "Unknown error"));
  }
                  } catch (e) {
                    setSummary("Error: " + e.message);
                  } finally {
                    setSumL(false);
                  }
                }}`;

const replacementOnClick = `                onClick={async () => {
                  if (!executeMultiProviderAI) return alert("AI Engine not configured or offline.");
                  setSumL(true);
                  try {
                    const profileChats = h.filter(x => !x.p || x.p === pr?.id);
                    
                    let palmHist = [];
                    let tarotHist = [];
                    try {
                       const pFile = await window.AppDB.getFile(\`gl_palmistry_analysis_\${emHash}_\${pr?.id || "default"}.json\`);
                       const pstr = typeof pFile.content.h === "string" ? await window.CryptoUtils.decrypt(pFile.content.h) : pFile.content.h;
                       palmHist = typeof pstr === "string" ? JSON.parse(pstr) : pstr || [];
                    } catch(e){}
                    try {
                       const tFile = await window.AppDB.getFile(\`gl_tarot_\${emHash}_\${pr?.id || "default"}.json\`);
                       const tstr = typeof tFile.content.history === "string" ? await window.CryptoUtils.decrypt(tFile.content.history) : tFile.content.history;
                       tarotHist = typeof tstr === "string" ? JSON.parse(tstr) : tstr || [];
                    } catch(e){}

                    if (profileChats.length === 0 && palmHist.length === 0 && tarotHist.length === 0) {
                      setSummary("No questions or readings have been recorded for this profile yet. Use the Sage Chat, Palmistry, or Tarot to build history.");
                      return;
                    }

                    let context = "";
                    if (profileChats.length > 0) {
                       context += "=== CHAT HISTORY ===\\n" + profileChats.map(c => \`Q: \${c.q}\\nA: \${c.a}\`).join("\\n\\n") + "\\n\\n";
                    }
                    if (palmHist.length > 0) {
                       context += "=== PALMISTRY READINGS ===\\n" + palmHist.map(c => \`Style: \${c.style}\\nAnalysis: \${c.analysis}\`).join("\\n\\n") + "\\n\\n";
                    }
                    if (tarotHist.length > 0) {
                       context += "=== TAROT READINGS ===\\n" + tarotHist.map(c => \`Q: \${c.question}\\nA: \${c.reading}\`).join("\\n\\n") + "\\n\\n";
                    }

                    const res = await executeMultiProviderAI(
                      "Based on the following past chat questions, palmistry, and tarot readings for this person, write a high-level executive summary of their core life themes, challenges, and predicted opportunities. Do not just summarize the history; provide an overarching psychological and predictive synthesis. Format with Markdown.\\n\\n" + context,
                      set,
                      "You are an expert Vedic Astrologer synthesizing a client profile."
                    );
                    if (res?.text) {
                      setSummary(res.text);
                      try {
                         const sumFile = await window.AppDB.getFile(\`gl_profile_summary_\${emHash}_\${pr?.id}.json\`);
                         sumFile.content.summary = await window.CryptoUtils.encrypt(res.text);
                         await window.AppDB.saveFile(\`gl_profile_summary_\${emHash}_\${pr?.id}.json\`, sumFile.content, sumFile.sha);
                      } catch(e){}
                    } else {
                      setSummary("Synthesis failed. Errors: " + (window.lastAIProviderErrors ? window.lastAIProviderErrors.join(", ") : "Unknown error"));
                    }
                  } catch (e) {
                    setSummary("Error: " + e.message);
                  } finally {
                    setSumL(false);
                  }
                }}`;

c = c.replace(targetOnClick, replacementOnClick);

fs.writeFileSync('src/jsx/tab-ask.jsx', c);
