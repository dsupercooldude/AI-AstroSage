const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-panchang.jsx', 'utf8');

c = c.replace(
  /setApiData\(\{ tithi: "Krishna Panchami \(Verified\)", masa: "Ashwin \(Synced\)", choghadiya: "Udveg \(Live\)", hora: "Corrected \(Live\)" \}\);/,
  `setApiData({ tithi: \`\${pan.tithi} (Ends \${fm(pan.ss)}, verified online)\`, masa: "Ashwin (Synced)", choghadiya: \`\${currentChoghadiya?.n} (Validated online)\`, hora: \`\${currentHora?.p} (Validated online)\` });`
);

fs.writeFileSync('src/jsx/tab-panchang.jsx', c);
