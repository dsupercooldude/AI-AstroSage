const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message, error.stack);
  });
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await browser.close();
})();
