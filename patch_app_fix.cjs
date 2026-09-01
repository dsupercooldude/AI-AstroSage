const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldTab = `          <TabOrchestrator
            pr={activeProfile}
            ch={activeChart}
            date={date}
          prs={profiles}
          chs={charts}
            setDate={setDate}
            settings={settings}
            onEditProfile={handleOpenEdit}
            prs={profiles}
            chs={charts}`;

const newTab = `          <TabOrchestrator
            pr={activeProfile}
            ch={activeChart}
            date={date}
            setDate={setDate}
            settings={settings}
            onEditProfile={handleOpenEdit}
            prs={profiles}
            chs={charts}`;

app = app.replace(oldTab, newTab);
fs.writeFileSync('src/App.tsx', app);
