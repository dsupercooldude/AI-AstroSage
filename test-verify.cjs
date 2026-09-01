const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(3000);
  
  console.log("ERRORS:", errors.length > 0 ? errors : "None");
  
  await browser.close();
})();
