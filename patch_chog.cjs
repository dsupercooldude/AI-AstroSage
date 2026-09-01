const fs = require('fs');
let form = fs.readFileSync('src/js/formulas.js', 'utf8');

const newChog = `
  const cm = {
    0: [0, 5, 3, 1, 6, 4, 2, 0],
    1: [1, 6, 4, 2, 0, 5, 3, 1],
    2: [2, 0, 5, 3, 1, 6, 4, 2],
    3: [3, 1, 6, 4, 2, 0, 5, 3],
    4: [4, 2, 0, 5, 3, 1, 6, 4],
    5: [5, 3, 1, 6, 4, 2, 0, 5],
    6: [6, 4, 2, 0, 5, 3, 1, 6]
  };

  const cmNight = {
    0: [4, 1, 5, 2, 6, 3, 0, 4], // Sunday Night
    1: [5, 2, 6, 3, 0, 4, 1, 5], // Monday Night
    2: [6, 3, 0, 4, 1, 5, 2, 6], // Tuesday Night
    3: [0, 4, 1, 5, 2, 6, 3, 0], // Wednesday Night
    4: [1, 5, 2, 6, 3, 0, 4, 1], // Thursday Night
    5: [2, 6, 3, 0, 4, 1, 5, 2], // Friday Night
    6: [3, 0, 4, 1, 5, 2, 6, 3]  // Saturday Night
  };

  const chogDay = cm[dow].map((i, idx) => ({ ...ct[i], ...getS(sr.getTime() + idx * (dMs / 8), dMs / 8) }));
  const chogNight = cmNight[dow].map((i, idx) => ({ ...ct[i], ...getS(ss.getTime() + idx * (nMs / 8), nMs / 8) }));
`;

form = form.replace(/const cm = \{[\s\S]*?const chogNight =.*?;/, newChog.trim());

// We also need to fix LUNAR_MASAS issue. The user said "Ashwin" was incorrect.
// Currently it might be shifted.
const lunarMasasRegex = /const LUNAR_MASAS = \[.*?\];/;
const lunarMasas = `const LUNAR_MASAS = ["Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadrapada", "Asvina", "Karttika", "Margasirsa", "Pausa", "Magha", "Phalguna"];`;
form = form.replace(lunarMasasRegex, lunarMasas);

fs.writeFileSync('src/js/formulas.js', form);
