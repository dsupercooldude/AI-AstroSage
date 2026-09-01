const fs = require('fs');
let tabs = fs.readFileSync('src/jsx/tabs.jsx', 'utf8');

const imgMap = `
  const bgImages = {
    person: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
    reports: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
    panchang: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?q=80&w=1920&auto=format&fit=crop",
    union: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1920&auto=format&fit=crop",
    palmistry: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=1920&auto=format&fit=crop",
    tarot: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1920&auto=format&fit=crop",
    week: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1920&auto=format&fit=crop",
    month: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop",
    ask: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1920&auto=format&fit=crop"
  };
`;

tabs = tabs.replace('const themeMap = {', imgMap + '\n  const themeMap = {');

const replacement = `
    <Fragment>
      <div className="fixed inset-0 -z-30 bg-black"></div>
      {/* Background Images for Preloading to avoid flicker */}
      {Object.entries(bgImages).map(([key, url]) => (
        <div 
          key={key}
          className={\`fixed inset-0 -z-20 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat mix-blend-screen \${tb === key ? 'opacity-30' : 'opacity-0'}\`}
          style={{ backgroundImage: \`url(\${url})\` }}
        ></div>
      ))}
      <div className={\`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 \${activeTheme} opacity-80\`}></div>
`;

tabs = tabs.replace(/<Fragment>\s*<div className=\{`fixed inset-0 -z-10 bg-gradient-to-br transition-colors duration-1000 \$\{activeTheme\}`\}><\/div>/, replacement);

fs.writeFileSync('src/jsx/tabs.jsx', tabs);
