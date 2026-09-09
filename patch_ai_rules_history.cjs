const fs = require('fs');
let c = fs.readFileSync('src/js/ai-rules.js', 'utf8');

c = c.replace(
  /window\.executeMultiProviderAI = async \(prompt, settings, systemPrompt\) => \{/,
  `window.executeMultiProviderAI = async (prompt, settings, systemPrompt, chatHistory = []) => {`
);

// Gemini
c = c.replace(
  /const body = \{\s*contents: \[\{ role: "user", parts: \[\{ text: prompt \}\] \}\],\s*generationConfig: \{ temperature: 0\.7, maxOutputTokens: 4096 \}\s*\};/g,
  `const contents = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: "user", parts: [{ text: prompt }] });
    const body = {
      contents: contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
    };`
);

// OpenAI, Groq, DeepSeek, Kimi, OpenRouter
const messageReplacementRegex = /messages: \[\{ role: "system", content: systemPrompt \}, \{ role: "user", content: prompt \}\]/g;
c = c.replace(
  messageReplacementRegex,
  `messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          ...chatHistory.map(msg => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.text })),
          { role: "user", content: prompt }
        ]`
);

// Pollinations
c = c.replace(
  /messages: \[\s*\{\s*role: "system",\s*content: systemPrompt\s*\},\s*\{\s*role: "user",\s*content: prompt\s*\}\s*\]/g,
  `messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        ...chatHistory.map(msg => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.text })),
        { role: "user", content: prompt }
      ]`
);

// HuggingFace
c = c.replace(
  /inputs: \`<s>\\\[INST\\\] \$\{systemPrompt\}\\n\\nUser Question: \$\{prompt\} \\\[\/INST\\\]\`,/,
  `inputs: \`<s>[INST] \${systemPrompt}\\n\\n\${chatHistory.map(m => m.role === 'user' ? 'User: ' + m.text : 'Assistant: ' + m.text).join('\\n\\n')}\\n\\nUser Question: \${prompt} [/INST]\`,`
);

fs.writeFileSync('src/js/ai-rules.js', c);
