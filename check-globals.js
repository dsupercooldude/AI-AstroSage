const fs = require('fs');
const files = fs.readdirSync('./src/jsx').filter(f => f.endsWith('.jsx'));

let globalsDefined = [];
let globalsUsed = [];

// Find what's attached to window.XXX = ...
files.forEach(f => {
  const content = fs.readFileSync('./src/jsx/' + f, 'utf8');
  let match;
  const regexDef = /window\.([a-zA-Z0-9_]+)\s*=/g;
  while ((match = regexDef.exec(content)) !== null) {
    globalsDefined.push(match[1]);
  }
});

// App.tsx uses some
const appTsx = fs.readFileSync('./src/App.tsx', 'utf8');
const regexApp = /window\.\w+/g; // Too broad, let's just look at specific JSX tags or window accesses
let matchApp;
while ((matchApp = regexApp.exec(appTsx)) !== null) {
  globalsUsed.push(matchApp[0].replace('window.', ''));
}

console.log("Defined on window in JSX:", [...new Set(globalsDefined)]);
console.log("Used from window in App.tsx:", [...new Set(globalsUsed)]);
