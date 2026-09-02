const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const animatedBgCSS = `
      body {
        font-family: 'Sora', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #050505;
        background-image: radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.08), transparent 25%),
                          radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.08), transparent 25%);
        background-attachment: fixed;
        color: #f1f5f9;
        position: relative;
      }
      body::before {
        content: "";
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTAgOEw4IDBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiPjwvcGF0aD4KPC9zdmc+') repeat;
        z-index: -1;
        pointer-events: none;
      }
      @keyframes floatGlow {
        0% { transform: translateY(0px) scale(1); opacity: 0.4; }
        50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; }
        100% { transform: translateY(0px) scale(1); opacity: 0.4; }
      }
      .bg-ambient {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: -2;
        overflow: hidden;
        pointer-events: none;
      }
      .bg-ambient-blob1 {
        position: absolute;
        top: -10%; left: -10%;
        width: 50vw; height: 50vw;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(0,0,0,0) 70%);
        animation: floatGlow 20s infinite ease-in-out alternate;
      }
      .bg-ambient-blob2 {
        position: absolute;
        bottom: -10%; right: -10%;
        width: 60vw; height: 60vw;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, rgba(0,0,0,0) 70%);
        animation: floatGlow 25s infinite ease-in-out alternate-reverse;
      }
`;

code = code.replace(
  /body \{\n\s*font-family: 'Sora', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n\s*background-color: #09090b;\n\s*color: #f1f5f9;\n\s*\}/,
  animatedBgCSS
);

// Add the ambient blobs into the body
code = code.replace(
  /<body>/,
  '<body>\n    <div class="bg-ambient"><div class="bg-ambient-blob1"></div><div class="bg-ambient-blob2"></div></div>'
);

fs.writeFileSync('index.html', code);
