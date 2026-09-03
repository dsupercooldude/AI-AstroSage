const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

const target = `const GoogleTranslate = () => {
  useEffect(() => {
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,ur,sa,hi,fr,de,ja,ru,es,zh-CN',
          }, 'google_translate_element');
        }
      };
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).google && (window as any).google.translate) {
      document.getElementById('google_translate_element').innerHTML = '';
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ur,sa,hi,fr,de,ja,ru,es,zh-CN',
      }, 'google_translate_element');
    }
  }, []);
  return <div id="google_translate_element" className="shrink-0 [&_.goog-te-combo]:pl-6 [&_.goog-te-combo]:bg-transparent [&_.goog-te-combo]:outline-none [&_.goog-te-combo]:text-xs [&_.goog-te-combo]:cursor-pointer [&_.goog-te-combo]:text-white" style={{ minWidth: '100px' }}></div>;
};`;

const replace = `const GoogleTranslate = () => {
  useEffect(() => {
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          const el = document.getElementById('google_translate_element');
          if (el) {
            new (window as any).google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,ur,sa,hi,fr,de,ja,ru,es,zh-CN',
            }, 'google_translate_element');
          }
        }
      };
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).google && (window as any).google.translate) {
      const el = document.getElementById('google_translate_element');
      if (el) {
        el.innerHTML = '';
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ur,sa,hi,fr,de,ja,ru,es,zh-CN',
        }, 'google_translate_element');
      }
    }
  }, []);
  return <div id="google_translate_element" className="shrink-0 [&_.goog-te-combo]:pl-6 [&_.goog-te-combo]:bg-transparent [&_.goog-te-combo]:outline-none [&_.goog-te-combo]:text-xs [&_.goog-te-combo]:cursor-pointer [&_.goog-te-combo]:text-white" style={{ minWidth: '100px' }}></div>;
};`;

c = c.replace(target, replace);
fs.writeFileSync('src/App.tsx', c);
