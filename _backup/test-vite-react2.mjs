import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let errors = [];
  page.on('console', msg => {
     if (msg.type() === 'error') {
       errors.push(msg.text());
     }
  });
  page.on('pageerror', err => {
     errors.push(err.message);
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const evalResult = await page.evaluate(() => {
     return {
       react: !!window.React,
       component: !!window.React?.Component,
       winComp: !!window.Component
     };
  });
  console.log("Eval:", evalResult);
  console.log("Errors:", errors);
  await browser.close();
})();
