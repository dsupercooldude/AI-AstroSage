const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-tarot.jsx', 'utf8');

c = c.replace(
/This major archetype represents the core karmic theme surrounding your query "\$\{q\}". \$\{selectedMajor\.reversed \? 'Its energy is currently internalized, blocked, or requiring deep introspection\.' : 'Its energy is expressing itself openly and directly in your life trajectory\.'\} It governs the overarching spiritual lesson you are currently navigating./,
`This major archetype represents the core karmic theme surrounding your query "\${q}". \${selectedMajor.reversed ? 'Its energy is currently internalized, blocked, or requiring deep introspection.' : 'Its energy is expressing itself openly and directly in your life trajectory.'} \${pr?.name ? 'Aligned with your personal astrological profile (' + pr.name + ')' : ''}, it governs the overarching spiritual lesson you are currently navigating.`
);

fs.writeFileSync('src/jsx/tab-tarot.jsx', c);
