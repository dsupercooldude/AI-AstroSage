const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

code = code.replace(
  /const handleOpenEdit = \(profileObj = \{\}\) => \{ setFormData\(\{ id: profileObj\.id \|\| null, name: profileObj\.name \|\| "", dob: profileObj\.dob \|\| "2000-01-01", time: profileObj\.time \|\| "12:00", place: profileObj\.place \|\| "", lat: profileObj\.lat \|\| "", lon: profileObj\.lon \|\| "", utcOffset: profileObj\.utcOffset \|\| "5\.5", gotra: profileObj\.gotra \|\| "", jaati: profileObj\.jaati \|\| "", kulDevta: profileObj\.kulDevta \|\| "", gramDevta: profileObj\.gramDevta \|\| "", sthanDevta: profileObj\.sthanDevta \|\| "" \}\); setEd\(profileObj\); \};/,
  'const handleOpenEdit = (profileObj = {}) => { setFormData({ id: profileObj.id || null, name: profileObj.name || "", dob: profileObj.dob || "2000-01-01", time: profileObj.time || "12:00", place: profileObj.place || "", lat: profileObj.lat || "", lon: profileObj.lon || "", utcOffset: profileObj.utcOffset || "5.5", gotra: profileObj.gotra || "", jaati: profileObj.jaati || "", kulDevta: profileObj.kulDevta || "", gramDevta: profileObj.gramDevta || "", sthanDevta: profileObj.sthanDevta || "", sunOverride: profileObj.sunOverride || "", moonOverride: profileObj.moonOverride || "", ascOverride: profileObj.ascOverride || "", associatedProfileId: profileObj.associatedProfileId || "", associatedRelation: profileObj.associatedRelation || "" }); setEd(profileObj); };'
);

fs.writeFileSync('src/jsx/app.jsx', code);
