const fs = require('fs');
let code = fs.readFileSync('src/js/formulas.js', 'utf8');

const formatMarkdownFn = `
window.formatMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return window.React.createElement('div', { key: idx, className: "h-2" });
    if (trimmed.startsWith('### ')) return window.React.createElement('h3', { key: idx, className: "text-sm font-bold text-amber-300 mt-4 mb-2" }, trimmed.replace(/^###\\s/, ''));
    if (trimmed.startsWith('## ')) return window.React.createElement('h2', { key: idx, className: "text-base font-bold text-amber-400 mt-4 mb-2" }, trimmed.replace(/^##\\s/, ''));
    if (trimmed.startsWith('# ')) return window.React.createElement('h1', { key: idx, className: "text-lg font-bold text-amber-500 mt-4 mb-2 border-b border-[#27272a] pb-1" }, trimmed.replace(/^#\\s/, ''));
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const content = trimmed.replace(/^[*|-]\\s/, '');
      const parts = content.split(/(\\*\\*.*?\\*\\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return window.React.createElement('strong', { key: j, className: "text-amber-200 font-bold" }, part.slice(2, -2));
        }
        return part;
      });
      return window.React.createElement('div', { key: idx, className: "flex gap-2 items-start mt-1 mb-1" }, 
        window.React.createElement('span', { className: "text-amber-500/50 mt-1 shrink-0 text-xs" }, "✦"), 
        window.React.createElement('span', { className: "text-white/80" }, parts)
      );
    }
    const parts = trimmed.split(/(\\*\\*.*?\\*\\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return window.React.createElement('strong', { key: j, className: "text-amber-200 font-bold" }, part.slice(2, -2));
      }
      return part;
    });
    return window.React.createElement('div', { key: idx, className: "text-white/80 leading-relaxed mb-2" }, parts);
  });
};
`;

code += "\n" + formatMarkdownFn;
fs.writeFileSync('src/js/formulas.js', code);
