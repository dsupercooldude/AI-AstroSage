const fs = require('fs');
let palm = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

palm = palm.replace(
  'Place your palm inside the highlighted zone. The app is limited to hand-only capture and does not retain face imagery.',
  'Palm Capture Guidelines:\\n1. Hold hand flat & steady.\\n2. Ensure bright lighting without harsh shadows.\\n3. Fit palm inside the highlighted zone.\\nNote: The app is strictly limited to hand-only capture.'
);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', palm);
