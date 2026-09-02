const fs = require('fs');
let code = fs.readFileSync('src/jsx/tabs.jsx', 'utf8');

// Replace bg images with darker, better aesthetic choices
code = code.replace(/person: ".*?",/, 'person: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",'); // dark starry mountains
code = code.replace(/reports: ".*?",/, 'reports: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1920&auto=format&fit=crop",'); // dark galaxy
code = code.replace(/panchang: ".*?",/, 'panchang: "https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=1920&auto=format&fit=crop",'); // dark night sky
code = code.replace(/union: ".*?",/, 'union: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1920&auto=format&fit=crop",'); // abstract dark space
code = code.replace(/palmistry: ".*?",/, 'palmistry: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=1920&auto=format&fit=crop",'); // mysterious darkness
code = code.replace(/tarot: ".*?",/, 'tarot: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",'); // dark abstract
code = code.replace(/week: ".*?",/, 'week: "https://images.unsplash.com/photo-1504333638930-c8787321efa0?q=80&w=1920&auto=format&fit=crop",'); // dark sky eclipse
code = code.replace(/month: ".*?",/, 'month: "https://images.unsplash.com/photo-1475274047050-51d393442819?q=80&w=1920&auto=format&fit=crop",'); // dark aesthetic space
code = code.replace(/ask: ".*?"/, 'ask: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop"'); // dark purple AI abstract

// Increase darkness of overlay: look for style={{ backgroundImage: ... }} and see if there's a div below it
code = code.replace(/className="absolute inset-0 bg-black\/[0-9]+ z-0"/, 'className="absolute inset-0 bg-black/75 z-0"');
code = code.replace(/className="absolute inset-0 bg-gradient-to-t from-black via-black\/[0-9]+ to-transparent z-0"/, 'className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-0"');

fs.writeFileSync('src/jsx/tabs.jsx', code);
