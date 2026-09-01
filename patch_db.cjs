const fs = require('fs');

let db = fs.readFileSync('src/js/database.js', 'utf8');

db = db.replace(
  'loadConfig: function() {',
  'loadConfig: async function() {'
);

db = db.replace(
  'decoded = window.CryptoUtils ? window.CryptoUtils.decrypt(stored) : JSON.parse(stored);',
  'decoded = window.CryptoUtils ? await window.CryptoUtils.decrypt(stored) : JSON.parse(stored);'
);

db = db.replace(
  "localStorage.setItem('gl_db_config', window.CryptoUtils.encrypt(this.config));",
  "localStorage.setItem('gl_db_config', await window.CryptoUtils.encrypt(this.config));"
);

db = db.replace(
  'setConfig: function(o, r, t) {',
  'setConfig: async function(o, r, t) {'
);

db = db.replace(
  "localStorage.setItem('gl_db_config', window.CryptoUtils.encrypt(this.config));",
  "localStorage.setItem('gl_db_config', await window.CryptoUtils.encrypt(this.config));"
);

fs.writeFileSync('src/js/database.js', db);

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /const \[dbConfigured, setDbConfigured\] = useState\(\(\) => \{[\s\S]*?\}\);/,
  `const [dbConfigured, setDbConfigured] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = (window as any).AppDB ? await (window as any).AppDB.loadConfig() : true;
        setDbConfigured(res);
      } catch (e) {
        setDbConfigured(true);
      }
    })();
  }, []);`
);

fs.writeFileSync('src/App.tsx', app);
