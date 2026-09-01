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

  await page.goto('https://ais-dev-4ops2l6usqsby7gxpo7my4-909196650064.asia-east1.run.app', { waitUntil: 'networkidle' });
  
  console.log("Found errors:", errors.length);
  if (errors.length === 0) {
    const title = await page.title();
    console.log("Title:", title);
  }
  await browser.close();
})();
