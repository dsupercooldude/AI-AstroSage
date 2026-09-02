const fs = require('fs');
let code = fs.readFileSync('src/jsx/tab-ask.jsx', 'utf8');

// Fix: "Generate Profile summary based on the previous / old history questions specifc for the user logged in selected User Profile from dropdown"
// If x.p is undefined, it means it's old data from before profiles were attached. We can assume it belongs to the current profile.
code = code.replace(/const profileChats = h\.filter\(x => x\.p === pr\?\.id\);/, 
'const profileChats = h.filter(x => !x.p || x.p === pr?.id);');

// Make sure it has section confidence badge on synthesis if missing
code = code.replace(/<h3 className="font-serif text-xl text-white mb-2">Profile Synthesis: \{pr\?\.name\}<\/h3>/,
'<div className="flex justify-between items-center w-full mb-2"><h3 className="font-serif text-xl text-white">Profile Synthesis: {pr?.name}</h3><window.SectionConfidence score={95} type="ai" label="AI Sage" /></div>');

fs.writeFileSync('src/jsx/tab-ask.jsx', code);
