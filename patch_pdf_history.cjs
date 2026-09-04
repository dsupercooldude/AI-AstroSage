const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

c = c.replace(
  /const valid = palmistryHistory\.filter\(\(item\) => Date\.now\(\) - new Date\(item\.ts\)\.getTime\(\) <= 30 \* 24 \* 60 \* 60 \* 1000\);\s*if \(valid\.length > 0\) \{\s*const recent = valid\.slice\(\)\.reverse\(\)\.slice\(0, 3\);/s,
  `const valid = palmistryHistory.slice().reverse();
          if (valid.length > 0) {
            const recent = valid;`
);

c = c.replace(
  /const valid = tarotHistory\.filter\(\(item\) => Date\.now\(\) - new Date\(item\.ts\)\.getTime\(\) <= 30 \* 24 \* 60 \* 60 \* 1000\);\s*if \(valid\.length > 0\) \{\s*const recent = valid\.slice\(\)\.reverse\(\)\.slice\(0, 3\);/s,
  `const valid = tarotHistory.slice().reverse();
          if (valid.length > 0) {
            const recent = valid;`
);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
