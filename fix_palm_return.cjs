const fs = require('fs');
let palm = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

palm = palm.replace(
  '<div className="max-w-6xl mx-auto space-y-6 gl-fadein pb-20">',
  'return (\\n    <div className="max-w-6xl mx-auto space-y-6 gl-fadein pb-20">'
);

fs.writeFileSync('src/jsx/tab-palmistry.jsx', palm);
