const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

if (!c.includes('apple-mobile-web-app-capable')) {
  c = c.replace(
    /<\/head>/,
    `  <meta name="theme-color" content="#09090b" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="VedicOracle" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</head>`
  );
  fs.writeFileSync('index.html', c);
}
