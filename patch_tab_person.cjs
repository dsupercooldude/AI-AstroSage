const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8');

c = c.replace(
  /\{window\.BiocycleWidget && <window\.BiocycleWidget dob=\{pr\.dob\} targetDate=\{date\} utcOffset=\{pr\.utcOffset\} \/>\}/g,
  `{window.BiocycleWidget && <window.BiocycleWidget dob={pr.dob} targetDate={date} utcOffset={pr.utcOffset} ch={ch} pr={pr} />}`
);

fs.writeFileSync('src/jsx/tab-person.jsx', c);
