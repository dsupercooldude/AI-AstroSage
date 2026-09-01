const fs = require('fs');

// src/App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/CryptoUtils\.decrypt\(vaultFile\.content\.profiles\)/g, 'await CryptoUtils.decrypt(vaultFile.content.profiles)');
app = app.replace(/CryptoUtils\.decrypt\(vaultFile\.content\.settings\)/g, 'await CryptoUtils.decrypt(vaultFile.content.settings)');
app = app.replace(/CryptoUtils\.encrypt\(newProfiles\)/g, 'await CryptoUtils.encrypt(newProfiles)');
app = app.replace(/CryptoUtils\.encrypt\(settings\)/g, 'await CryptoUtils.encrypt(settings)');
app = app.replace(/CryptoUtils\.encrypt\(ns\)/g, 'await CryptoUtils.encrypt(ns)');
fs.writeFileSync('src/App.tsx', app);

// src/jsx/app.jsx
let appJsx = fs.readFileSync('src/jsx/app.jsx', 'utf8');
appJsx = appJsx.replace(/CryptoUtils\.decrypt\(vaultFile\.content\.profiles\)/g, 'await CryptoUtils.decrypt(vaultFile.content.profiles)');
appJsx = appJsx.replace(/CryptoUtils\.decrypt\(vaultFile\.content\.settings\)/g, 'await CryptoUtils.decrypt(vaultFile.content.settings)');
appJsx = appJsx.replace(/CryptoUtils\.encrypt\(nP\)/g, 'await CryptoUtils.encrypt(nP)');
appJsx = appJsx.replace(/CryptoUtils\.encrypt\(set\)/g, 'await CryptoUtils.encrypt(set)');
appJsx = appJsx.replace(/CryptoUtils\.encrypt\(ns\)/g, 'await CryptoUtils.encrypt(ns)');
fs.writeFileSync('src/jsx/app.jsx', appJsx);

// src/jsx/modals.jsx
let modals = fs.readFileSync('src/jsx/modals.jsx', 'utf8');
modals = modals.replace(/CryptoUtils\.decrypt\(vaultFile\.content\.profiles\)/g, 'await CryptoUtils.decrypt(vaultFile.content.profiles)');
modals = modals.replace(/CryptoUtils\.decrypt\(vaultFile\.content\.settings\)/g, 'await CryptoUtils.decrypt(vaultFile.content.settings)');
modals = modals.replace(/CryptoUtils\.decrypt\(u\.mfa\)/g, 'await CryptoUtils.decrypt(u.mfa)');
modals = modals.replace(/CryptoUtils\.decrypt\(adminFile\.content\.mfa\)/g, 'await CryptoUtils.decrypt(adminFile.content.mfa)');
modals = modals.replace(/CryptoUtils\.encrypt\(adminMfaSetup\.secret\)/g, 'await CryptoUtils.encrypt(adminMfaSetup.secret)');
modals = modals.replace(/CryptoUtils\.encrypt\(mfaSetup\.secret\)/g, 'await CryptoUtils.encrypt(mfaSetup.secret)');
fs.writeFileSync('src/jsx/modals.jsx', modals);

// src/jsx/tab-ask.jsx
let tabAsk = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');
tabAsk = tabAsk.replace(/CryptoUtils\.decrypt\(chatsFile\.content\.h\)/g, 'await CryptoUtils.decrypt(chatsFile.content.h)');
tabAsk = tabAsk.replace(/CryptoUtils\.encrypt\(nx\)/g, 'await CryptoUtils.encrypt(nx)');
fs.writeFileSync('src/jsx/tab-ask.jsx', tabAsk);

