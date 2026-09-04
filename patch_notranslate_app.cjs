const fs = require('fs');
let c = fs.readFileSync('src/jsx/app.jsx', 'utf8');

c = c.replace(
  /<option className="bg-\[#09090b\] text-white" key=\{p\.id\} value=\{p\.id\}>\{p\.name\.split\(" "\)\[0\]\}<\/option>/g,
  `<option className="bg-[#09090b] text-white notranslate" key={p.id} value={p.id}>{p.name.split(" ")[0]}</option>`
);

fs.writeFileSync('src/jsx/app.jsx', c);
