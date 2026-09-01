const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  await page.goto('http://localhost:3007/AstroGrah/');
  await page.waitForTimeout(2000);
  const content = await page.content();
  if (content.includes("Initializing Graha Ledger Engine")) {
     console.log("FAILED to hide bootloader");
  } else {
     console.log("Bootloader hidden!");
  }
  await browser.close();
})();
