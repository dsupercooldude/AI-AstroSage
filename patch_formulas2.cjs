const fs = require('fs');
let c = fs.readFileSync('src/js/formulas.js', 'utf8');

c = c.replace(
  /const shadbalaMeaning = `.*?`;/,
  `const shadbalaMeaning = \`Shadbala is a mathematical system that measures the exact 'weight' or power of each planet in your chart. Unlike a simple placement, it calculates six different sources of strength (like position, direction, and time of day). \${pr?.name || "Your"} highest scoring planet is \${topPlanet} (at \${(ch.shadbala?.[topPlanet] / 60 || 0).toFixed(1)} Rupas). This means you have a natural, effortless advantage in the areas of life governed by \${topPlanet}. Conversely, your lowest scoring planet is \${weakPlanet}. This isn't a "bad" thing—it just indicates an area where you must apply conscious effort, planning, and patience to see results.\`;`
);

c = c.replace(
  /const gocharaMeaning = `.*?`;/,
  `const gocharaMeaning = \`While your birth chart is the fixed map of your life, 'Gochara' (Transit) tracks where the planets are currently orbiting in the sky *today*, relative to your birth chart. For \${pr?.name || "you"} on \${tD.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}, these movements are creating real-time energetic shifts. \${Object.entries(ch.transits || {}).map(([planet, sign]) => \`\${planet} is currently moving through \${sign}\`).join(", ")}. Understanding these transits helps you navigate the immediate atmosphere—showing you when to push forward and when to rest based on today's cosmic weather.\`;`
);

c = c.replace(
  /pdfShadbala: `.*?`,/,
  `pdfShadbala: \`Shadbala calculates the exact mathematical "weight" or power of each planet in your chart. Your highest scoring planet is \${topPlanet}. You have a natural advantage in areas governed by it. Conversely, your lowest scoring planet is \${weakPlanet}, indicating a life area where you must apply conscious effort, planning, and patience.\`, `
);

fs.writeFileSync('src/js/formulas.js', c);
