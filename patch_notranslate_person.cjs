const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

c = c.replace(
  /<h2 className="font-serif text-3xl text-white mb-1">\{pr\?\.name\}<\/h2>/g,
  `<h2 className="font-serif text-3xl text-white mb-1 notranslate">{pr?.name}</h2>`
);

fs.writeFileSync('src/jsx/tab-person.jsx', c);
