const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const search = `  if (!user) {`;

const replace = `  if (user && user.requiresPasswordChange) {
    const ForcePasswordChange = (window as any).ForcePasswordChange;
    return (
      <div className="min-h-screen w-full font-sans pb-16 bg-transparent text-slate-200 selection:bg-indigo-500 selection:text-white relative">
        <div className="fixed inset-0 -z-30 bg-black"></div>
        {ForcePasswordChange && (
          <ForcePasswordChange 
            email={user.email} 
            emailHash={user.emailHash} 
            onComplete={() => {
              setUser({...user, requiresPasswordChange: false});
              const lS = JSON.parse(localStorage.getItem('gl_active_user') || '{}');
              lS.requiresPasswordChange = false;
              localStorage.setItem('gl_active_user', JSON.stringify(lS));
            }} 
          />
        )}
      </div>
    );
  }

  if (!user) {`;

c = c.replace(search, replace);
fs.writeFileSync('src/App.tsx', c);
