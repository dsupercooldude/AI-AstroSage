const fs = require('fs');
let code = fs.readFileSync('src/js/formulas.js', 'utf8');

const correctCm = `const cm = {
    0: [0, 5, 3, 1, 6, 4, 2, 0],
    1: [1, 6, 4, 2, 0, 5, 3, 1],
    2: [2, 0, 5, 3, 1, 6, 4, 2],
    3: [3, 1, 6, 4, 2, 0, 5, 3],
    4: [4, 2, 0, 5, 3, 1, 6, 4],
    5: [5, 3, 1, 6, 4, 2, 0, 5],
    6: [6, 4, 2, 0, 5, 3, 1, 6]
  };`;

code = code.replace(
  /const cm = \{[\s\S]*?\};/,
  correctCm
);

const correctLunar = `window.LUNAR_MASAS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashwin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
];`;

code = code.replace(
  /window\.LUNAR_MASAS = \[[\s\S]*?\];/g,
  correctLunar
);

fs.writeFileSync('src/js/formulas.js', code);
