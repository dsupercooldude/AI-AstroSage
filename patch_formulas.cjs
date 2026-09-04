const fs = require('fs');
let c = fs.readFileSync('src/js/formulas.js', 'utf8');

c = c.replace(
  /d9: genC\(9\),/g,
  `d9: genC(9),
    d10: genC(10),
    d7: genC(7),
    d5: genC(5),`
);

fs.writeFileSync('src/js/formulas.js', c);
