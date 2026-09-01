const fs = require('fs');
let palm = fs.readFileSync('src/jsx/tab-palmistry.jsx', 'utf8');

// The first askPalmistry is at 77, the second is around 173. Let's remove the second one.
palm = palm.replace(/const askPalmistry = async \(\) => \{[\s\S]*?setIsLoading\(false\);\n  \};\n/, '');

fs.writeFileSync('src/jsx/tab-palmistry.jsx', palm);
