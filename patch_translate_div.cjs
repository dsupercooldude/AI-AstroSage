const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const tDiv = `
          <div className="flex items-center gap-2 flex-wrap">
            <div id="google_translate_element" className="shrink-0 mr-1 overflow-hidden" style={{ minWidth: '100px' }}></div>
`;

app = app.replace('<div className="flex items-center gap-2 flex-wrap">', tDiv);
fs.writeFileSync('src/App.tsx', app);
