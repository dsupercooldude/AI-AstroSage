require('playwright').chromium.launch().then(async browser => {
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:3007/AstroGrah/');
  await page.evaluate(() => {
    console.log("ErrorBoundary:", !!window.ErrorBoundary);
    console.log("SetupModal:", !!window.SetupModal);
    console.log("AuthModal:", !!window.AuthModal);
    console.log("ForcePasswordChange:", !!window.ForcePasswordChange);
    console.log("AdminAuthModal:", !!window.AdminAuthModal);
    console.log("AdminConsoleModal:", !!window.AdminConsoleModal);
    console.log("SettingsModal:", !!window.SettingsModal);
    console.log("TabOrchestrator:", !!window.TabOrchestrator);
    console.log("GhostPDFReport:", !!window.GhostPDFReport);
  });
  await browser.close();
});
