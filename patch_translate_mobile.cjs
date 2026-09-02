const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

code = code.replace(
  /<div id="google_translate_element" className="mr-3 scale-90 origin-right hidden md:block"><\/div>/,
  '<div id="google_translate_element" className="mr-3 scale-75 md:scale-90 origin-right"></div>'
);

fs.writeFileSync('src/jsx/app.jsx', code);
