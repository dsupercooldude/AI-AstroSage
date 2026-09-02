const fs = require('fs');
let code = fs.readFileSync('src/jsx/app.jsx', 'utf8');

code = code.replace(
  /const \[formData, setFormData\] = useState\(\{ name: "", dob: "2000-01-01", time: "12:00", place: "", lat: "", lon: "", utcOffset: "5\.5", gotra: "", jaati: "", kulDevta: "", gramDevta: "", sthanDevta: "" \}\);/,
  'const [formData, setFormData] = useState({ name: "", dob: "2000-01-01", time: "12:00", place: "", lat: "", lon: "", utcOffset: "5.5", gotra: "", jaati: "", kulDevta: "", gramDevta: "", sthanDevta: "", sunOverride: "", moonOverride: "", ascOverride: "", associatedProfileId: "", associatedRelation: "" });'
);

fs.writeFileSync('src/jsx/app.jsx', code);
