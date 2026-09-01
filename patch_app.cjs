const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace settings default aiModel
app = app.replace(
  'aiModel: "auto"',
  'aiModel: "free-ai"'
);

fs.writeFileSync('src/App.tsx', app);

let modals = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

modals = modals.replace(
  '<option value="offline">Offline Engine (No API Key)</option>',
  '<option value="free-ai">Public Free AI (Pollinations)</option>\n                  <option value="offline">Offline Engine (Deterministic)</option>'
);

fs.writeFileSync('src/jsx/modals.jsx', modals);
