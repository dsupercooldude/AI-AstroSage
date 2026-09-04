const fs = require('fs');
let c = fs.readFileSync('src/js/formulas.js', 'utf8');

c = c.replace(
  /tithi: \["Pratipada".*\]\[tIdx % 15\],/,
  `tithi: ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", isS ? "Purnima" : "Amavasya"][tIdx % 15] + " (Ends " + new Date(sr.getTime() + (dMs * 1.2)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ")",`
);

fs.writeFileSync('src/js/formulas.js', c);
