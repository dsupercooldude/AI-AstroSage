const fs = require('fs');
let code = fs.readFileSync('src/js/ai-rules.js', 'utf8');

code = code.replace(
/const callPollinations = async \(\) => \{[\s\S]*?return await res\.text\(\);\n\};/,
`const callPollinations = async () => {
  const res = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: "openai"
    })
  });
  if (!res.ok) throw new Error(\`Pollinations HTTP \${res.status}\`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
};`
);
fs.writeFileSync('src/js/ai-rules.js', code);
