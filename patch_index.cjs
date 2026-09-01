const fs = require('fs');
let idx = fs.readFileSync('index.html', 'utf8');

const css = `
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }

      /* Google Translate Overrides */
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      body { top: 0px !important; }
      .goog-te-gadget { color: transparent !important; }
      .goog-te-gadget span { display: none !important; }
      .goog-te-gadget select {
        background-color: #09090b !important;
        color: #818cf8 !important;
        border: 1px solid #3730a3 !important;
        padding: 4px 8px !important;
        border-radius: 6px !important;
        font-family: 'Sora', monospace !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        outline: none !important;
        cursor: pointer !important;
        width: 120px !important;
      }
      .goog-te-gadget select:hover { border-color: #4f46e5 !important; }
`;

idx = idx.replace('.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }', css);

fs.writeFileSync('index.html', idx);
