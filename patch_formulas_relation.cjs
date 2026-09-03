const fs = require('fs');
let c = fs.readFileSync('src/js/formulas.js', 'utf8');

const target = `window.calculateAshtakoot = (ch1, ch2) => {`;
const replace = `window.calculateAshtakoot = (ch1, ch2, relation = "Spouse") => {`;

c = c.replace(target, replace);
fs.writeFileSync('src/js/formulas.js', c);
