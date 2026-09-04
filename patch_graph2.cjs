const fs = require('fs');
let c = fs.readFileSync('src/jsx/relationship-graph.jsx', 'utf8');

c = c.replace(
  /\s*\}\n\s*\}\n\s*\}\n\s*const simulation = d3\.forceSimulation\(nodes\)/,
  `      }
    }
    const simulation = d3.forceSimulation(nodes)`
);

fs.writeFileSync('src/jsx/relationship-graph.jsx', c);
