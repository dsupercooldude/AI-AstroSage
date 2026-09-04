const fs = require('fs');
let c = fs.readFileSync('src/js/formulas.js', 'utf8');

c = c.replace(
  /const chalitMeaning = `.*?`;/,
  `const chalitMeaning = \`Your main birth chart (Lagna) is like a photograph of the sky the moment you were born, but the Bhava Chalit chart shows how that planetary energy actually spills over into your real life. Sometimes a planet appears to be in one house (life area) in your birth chart, but its true effect is felt in the neighboring house because of exact mathematical degrees. The Chalit chart is your "practical reality" chart. It reveals the true areas of life where you are currently experiencing the most friction or flow.\`;`
);

c = c.replace(
  /const shadbalaMeaning = `.*?`;/,
  `const shadbalaMeaning = \`Shadbala is a mathematical system that measures the exact 'weight' or power of each planet in your chart. Unlike a simple placement, it calculates six different sources of strength (like position, direction, and time of day). \${pr?.name || "Your"} highest scoring planet is \${topPlanet} (at \${(ch.shadbala?.[topPlanet] / 60 || 0).toFixed(1)} Rupas). Because \${topPlanet} is your absolute powerhouse, you should lean heavily into the traits it rules to solve problems (e.g., Sun = Leadership, Mercury = Logic, Jupiter = Wisdom). Conversely, your lowest scoring planet is \${weakPlanet}. This indicates your biggest blind spot—a specific life area where you must apply conscious effort, discipline, and patience because it lacks natural momentum.\`;`
);

c = c.replace(
  /const gocharaMeaning = `.*?`;/,
  `const gocharaMeaning = \`While your birth chart is the fixed map of your life, 'Gochara' (Transit) tracks where the planets are currently orbiting in the sky *today*, relative to your birth chart. For \${pr?.name || "you"} on \${tD.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}, these movements are creating real-time energetic shifts. \${Object.entries(ch.transits || {}).map(([planet, sign]) => \`\${planet} is currently activating \${sign}\`).join(", ")}. Understanding these transits helps you navigate the immediate atmosphere—it shows you exactly which areas of your birth chart are being triggered or pressured by the cosmic weather today, telling you when to act and when to wait.\`;`
);

c = c.replace(
  /backupAction: `.*?`/g,
  `backupAction: \`Dual-Remedy Protocol: If you are experiencing acute real-time stress, you must address both the fixed birth issue and the current transit issue. First, balance your lifelong birth chart weakness (\${weakPlanet}) by incorporating its discipline into your daily routine. Second, look to your Chalit (Working) chart and identify the planet currently transiting your 6th, 8th, or 12th house today. Chant the specific seed mantra of that transiting planet to immediately neutralize the temporary friction it is causing.\``
);

fs.writeFileSync('src/js/formulas.js', c);
