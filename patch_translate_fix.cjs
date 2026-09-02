const fs = require('fs');
let htmlCode = fs.readFileSync('index.html', 'utf8');

htmlCode = htmlCode.replace(
  /function googleTranslateElementInit\(\) \{[\s\S]*?\}\n\s*<\/script>/,
  `function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ru,hi,ur,sa,es,fr,ar,bn,zh-CN',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
      }
    </script>`
);

fs.writeFileSync('index.html', htmlCode);
