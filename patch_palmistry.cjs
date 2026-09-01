const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

code = code.replace(
  /const askPalmistry = \(\) => \{[\s\S]*?setQuestion\(''\);\s*\};/g,
  `const askPalmistry = async () => {
    const q = question.trim();
    if (!q) return;
    const currentQ = q;
    setQuestion('');
    setChat((prev) => [
      ...prev,
      { role: 'user', text: currentQ },
      { role: 'assistant', text: 'Analyzing your palm lines via AI...' }
    ]);
    
    try {
      const summary = analysis || "a generic palm shape";
      const prompt = \`The user's hand analysis is: "\${summary}". They are asking: "\${currentQ}". Provide a short, precise Vedic palmistry reading answering their question.\`;
      const res = await window.queryAI(prompt, "auto");
      
      setChat((prev) => {
        const newChat = [...prev];
        newChat[newChat.length - 1] = { role: 'assistant', text: res?.text || "The AI could not process the palmistry question at this time. Please try again." };
        return newChat;
      });
    } catch (e) {
      setChat((prev) => {
        const newChat = [...prev];
        newChat[newChat.length - 1] = { role: 'assistant', text: "Error connecting to AI engine." };
        return newChat;
      });
    }
  };`
);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', code);
