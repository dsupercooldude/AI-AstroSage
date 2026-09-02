const fs = require('fs');

const injectBadge = (file, searchStr, badgeCode) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  // Avoid duplicating badges if one already exists in the same tag line
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchStr)) {
      if (!lines[i].includes('SectionConfidence')) {
        // If it's an h2 or h3 or div, insert the badge before closing tag
        lines[i] = lines[i].replace(/(<\/h[23]>|<\/div>)/, ` ${badgeCode}$1`);
        // Add flex classes to the opening tag if missing
        lines[i] = lines[i].replace(/className="/, 'className="flex justify-between items-center w-full ');
      }
    }
  }
  fs.writeFileSync(file, lines.join('\n'));
};

injectBadge('src/jsx/tab-person.jsx', 'Architectural Reading', '<window.SectionConfidence score={92} type="ai" label="AI Synthesis" />');
injectBadge('src/jsx/tab-person.jsx', 'Vedic Charts', '<window.SectionConfidence score={100} type="math" label="Astrodynamics Engine" />');
injectBadge('src/jsx/tab-person.jsx', 'Remediation', '<window.SectionConfidence score={88} type="ai" label="AI Jyotish Engine Synthesis" />');
injectBadge('src/jsx/tab-person.jsx', 'Bio', '<window.SectionConfidence score={95} type="math" label="Biocycle" />'); // biocycle

injectBadge('src/jsx/tab-panchang.jsx', 'Vedic Panchang', '<window.SectionConfidence score={99} type="math" label="Math Engine" />');
injectBadge('src/jsx/tab-panchang.jsx', '7-Day', '<window.SectionConfidence score={99} type="math" label="Math Engine" />');
injectBadge('src/jsx/tab-panchang.jsx', 'Sunrise', '<window.SectionConfidence score={99} type="math" label="Math Engine" />');

injectBadge('src/jsx/tab-palmistry.jsx', 'Ask the palmistry', '<window.SectionConfidence score={85} type="ai" label="AI Palmistry Engine" />');

injectBadge('src/jsx/tab-union.jsx', 'Deep Relationship', '<window.SectionConfidence score={90} type="ai" label="Ask AI in Union" />');

