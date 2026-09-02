const fs = require('fs');
let htmlCode = fs.readFileSync('index.html', 'utf8');

const svgReplacement = `<div class="bg-ambient">
      <div class="bg-ambient-blob1"></div>
      <div class="bg-ambient-blob2"></div>
      <svg class="dynamic-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,5 95,95 5,95" fill="none" stroke="#4f46e5" stroke-width="2"/>
        <circle cx="50" cy="50" r="20" fill="none" stroke="#ec4899" stroke-width="2"/>
      </svg>
      <svg class="dynamic-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" stroke-width="1" stroke-dasharray="5,5"/>
        <path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" fill="none" stroke="#ec4899" stroke-width="2"/>
      </svg>
    </div>`;

htmlCode = htmlCode.replace(
  /<body([^>]*)>/,
  '<body$1>\n    ' + svgReplacement
);

fs.writeFileSync('index.html', htmlCode);
