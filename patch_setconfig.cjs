const fs = require('fs');
let modals = fs.readFileSync('src/jsx/modals.jsx', 'utf8');

modals = modals.replace(
  'AppDB.setConfig(o,r,t);',
  'await AppDB.setConfig(o,r,t);'
);

modals = modals.replace(
  'const handleSaveDb = (e) => { e.preventDefault(); if(!confirm("Update Database Configuration?")) return; AppDB.setConfig(o, r, t); alert("Database configuration updated successfully."); onClose(); };',
  'const handleSaveDb = async (e) => { e.preventDefault(); if(!confirm("Update Database Configuration?")) return; await AppDB.setConfig(o, r, t); alert("Database configuration updated successfully."); onClose(); };'
);

fs.writeFileSync('src/jsx/modals.jsx', modals);
