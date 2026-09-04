const fs = require('fs');
let c = fs.readFileSync('vite.config.ts', 'utf8');

c = c.replace(
  /plugins: \[react\(\), tailwindcss\(\)\],/,
  `plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'Vedic Oracle App',
          short_name: 'VedicOracle',
          description: 'A modern installable web application for Vedic Astrology.',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      })
    ],`
);

c = `import { VitePWA } from 'vite-plugin-pwa';\n` + c;

fs.writeFileSync('vite.config.ts', c);
