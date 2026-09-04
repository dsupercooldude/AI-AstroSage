const fs = require('fs');
let c = fs.readFileSync('src/js/formulas.js', 'utf8');

c = c.replace(
  /dynamicPrescription: \{ gem:.*\},/,
  `dynamicPrescription: { 
      gem: window.PLANET_INFO[lagnaLord]?.gem, 
      charity: window.PLANET_INFO[weakPlanet]?.charity, 
      mantra: window.PLANET_INFO[activeAntar]?.beej, 
      deity: window.PLANET_INFO[lagnaLord]?.adhidevata, 
      action: \`Fortify your weakest link (\${weakPlanet}) by observing its specific discipline, while ruthlessly leveraging your dominant \${topPlanet} for major decisions.\`,
      backupAction: \`Backup Protocol (Chalit & Transit Integration): If the primary remedy feels blocked, look to your current transiting planet in the 1st, 5th, or 9th Chalit house. Address immediate friction by chanting the seed mantra of the planet currently transiting your 6th or 8th house, while balancing your static birth weakness (\${weakPlanet}) through consistent daily routines.\`
    },`
);

fs.writeFileSync('src/js/formulas.js', c);
