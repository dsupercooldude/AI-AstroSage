const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const translateScript = `
    <!-- Google Translate Script -->
    <script type="text/javascript">
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
      }
    </script>
    <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
`;

if (!code.includes('googleTranslateElementInit')) {
  code = code.replace(/<\/head>/, translateScript + '</head>');
  fs.writeFileSync('index.html', code);
}
