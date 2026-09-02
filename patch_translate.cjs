const fs = require('fs');

// Patch index.html
let htmlCode = fs.readFileSync('index.html', 'utf8');

htmlCode = htmlCode.replace(
  /function googleTranslateElementInit\(\) \{[\s\S]*?\}/,
  "function googleTranslateElementInit() {\n        new google.translate.TranslateElement({\n          pageLanguage: 'en',\n          includedLanguages: 'en,ru,hi,ur,sa,es,fr,ar,bn,zh-CN',\n          layout: google.translate.TranslateElement.InlineLayout.SIMPLE\n        }, 'google_translate_element');\n      }"
);

const animatedBgCSS = `      body {
        font-family: 'Sora', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: #020205;
        background-image: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15), transparent 30%),
                          radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.15), transparent 30%);
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
        0% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.4; }
        50% { transform: translateY(-30px) scale(1.1) rotate(45deg); opacity: 0.7; }
        100% { transform: translateY(0px) scale(1) rotate(90deg); opacity: 0.4; }
      }
      @keyframes floatShape {
        0% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(30px, -50px) rotate(120deg); }
        66% { transform: translate(-20px, 40px) rotate(240deg); }
        100% { transform: translate(0, 0) rotate(360deg); }
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
        background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(0,0,0,0) 70%);
        animation: floatGlow 20s infinite ease-in-out alternate;
      }
      .bg-ambient-blob2 {
        position: absolute;
        bottom: -10%; right: -10%;
        width: 60vw; height: 60vw;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(0,0,0,0) 70%);
        animation: floatGlow 25s infinite ease-in-out alternate-reverse;
      }
      .dynamic-svg {
        position: absolute;
        opacity: 0.07;
        animation: floatShape 30s infinite linear;
      }
      .dynamic-svg:nth-child(3) { top: 20%; left: 15%; width: 300px; animation-duration: 45s; }
      .dynamic-svg:nth-child(4) { bottom: 15%; right: 10%; width: 400px; animation-duration: 60s; animation-direction: reverse; }`;

htmlCode = htmlCode.replace(
  /body \{\n\s*font-family: 'Sora'[\s\S]*?\.bg-ambient-blob2 \{[\s\S]*?\}\n/,
  animatedBgCSS + '\n'
);

const svgReplacement = `<div class="bg-ambient">
      <div class="bg-ambient-blob1"></div>
      <div class="bg-ambient-blob2"></div>
      <svg class="dynamic-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,5 95,95 5,95" fill="none" stroke="#4f46e5" stroke-width="2"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#ec4899" stroke-width="2"/>
      </svg>
      <svg class="dynamic-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" stroke-width="1" stroke-dasharray="5,5"/>
        <path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" fill="none" stroke="#ec4899" stroke-width="2"/>
      </svg>
    </div>`;

htmlCode = htmlCode.replace(
  /<div class="bg-ambient"><div class="bg-ambient-blob1"><\/div><div class="bg-ambient-blob2"><\/div><\/div>/,
  svgReplacement
);

fs.writeFileSync('index.html', htmlCode);

// Patch app.jsx
let jsxCode = fs.readFileSync('src/jsx/app.jsx', 'utf8');

const jsxReplacement = `<div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-3 mr-2 md:mr-4">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold whitespace-nowrap">Please select Language:</span>
                  <div id="google_translate_element" className="scale-75 md:scale-90 origin-right"></div>
                </div>`;

jsxCode = jsxCode.replace(
  /<div id="google_translate_element" className="mr-3 scale-75 md:scale-90 origin-right"><\/div>/,
  jsxReplacement
);

fs.writeFileSync('src/jsx/app.jsx', jsxCode);
