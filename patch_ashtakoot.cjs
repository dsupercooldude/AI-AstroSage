const fs = require('fs');
let c = fs.readFileSync('src/js/formulas.js', 'utf8');

const targetTotal = `  const total = varna + vashya + tara + yoni + maitri + gana + bhakoot + nadi;
  return {
    score: total,
    details: { Varna: varna, Vashya: vashya, Tara: tara, Yoni: yoni, Maitri: maitri, Gana: gana, Bhakoot: bhakoot, Nadi: nadi }
  };`;

const replaceTotal = `  let adj = { Varna: varna, Vashya: vashya, Tara: tara, Yoni: yoni, Maitri: maitri, Gana: gana, Bhakoot: bhakoot, Nadi: nadi };
  let maxScore = 36;
  
  // Non-romantic overrides
  if (!["Spouse", "Girlfriend"].includes(relation)) {
      // For family, friends, and business, physical chemistry (Yoni) and genetics (Nadi) are irrelevant.
      // We scale up Maitri (friendship), Gana (temperament), and Bhakoot (direction).
      adj.Yoni = 0;
      adj.Nadi = 0;
      adj.Vashya = vashya; // Influence is still relevant
      adj.Maitri = (maitri / 5) * 10; // Scale to 10
      adj.Gana = (gana / 6) * 10; // Scale to 10
      adj.Bhakoot = (bhakoot / 7) * 10; // Scale to 10
      // Max score remains 1 + 2 + 3 + 0 + 10 + 10 + 10 + 0 = 36.
  }
  
  if (relation === "Family") {
      adj.Maitri = (maitri / 5) * 12;
      adj.Bhakoot = (bhakoot / 7) * 12;
      adj.Tara = (tara / 3) * 6;
      adj.Vashya = (vashya / 2) * 3;
      adj.Gana = (gana / 6) * 3;
  }
  
  const total = adj.Varna + adj.Vashya + adj.Tara + adj.Yoni + adj.Maitri + adj.Gana + adj.Bhakoot + adj.Nadi;
  return {
    score: Math.min(36, total), // Cap at 36 just in case
    details: adj
  };`;

c = c.replace(targetTotal, replaceTotal);
fs.writeFileSync('src/js/formulas.js', c);
