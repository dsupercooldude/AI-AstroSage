import { chromium } from 'playwright';
import { spawn } from 'child_process';

const server = spawn('npm', ['run', 'start'], { stdio: 'inherit' });

setTimeout(async () => {
  try {
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
    
    console.log("Found errors:", errors.length);
    if (errors.length === 0) {
      const title = await page.title();
      console.log("Title:", title);
    }
    await browser.close();
  } finally {
    server.kill();
    process.exit(0);
  }
}, 2000);
