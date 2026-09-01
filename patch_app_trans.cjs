const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const tInit = `
  useEffect(() => {
    const bootloader = document.getElementById("bootloader");
    if (bootloader) {
      bootloader.style.display = "none";
    }
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,ur,sa,hi,fr,de,ja,ru,es,zh-CN',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
          }, 'google_translate_element');
        }
      };
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
`;

app = app.replace(/useEffect\(\(\) => \{\s*const bootloader = document\.getElementById\("bootloader"\);\s*if \(bootloader\) \{\s*bootloader\.style\.display = "none";\s*\}\s*\}, \[\]\);/, tInit);

fs.writeFileSync('src/App.tsx', app);
