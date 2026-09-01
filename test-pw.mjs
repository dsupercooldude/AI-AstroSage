import { chromium } from 'playwright';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const server = app.listen(3003, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
     if (msg.type() === 'error') {
       console.log('CONSOLE ERROR:', msg.text(), msg.location());
     }
  });
  
  page.on('pageerror', err => {
     console.log('PAGE ERROR:', err.message, err.stack);
  });

  await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });
  
  await browser.close();
  server.close();
});
