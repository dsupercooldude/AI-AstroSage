import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let errors = [];
  page.on('console', msg => {
     if (msg.type() === 'error') {
       errors.push(msg.text());
       console.log('CONSOLE ERROR:', msg.text());
     }
  });
  page.on('pageerror', err => {
     errors.push(err.message);
     console.log('PAGE ERROR:', err.message);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  const comp = await page.evaluate(() => {
     return !!window.Component;
  });
  console.log("window.Component exists:", comp);

  await browser.close();
})();
