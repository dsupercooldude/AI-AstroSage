const fs = require('fs');
let lines = fs.readFileSync('src/jsx/tab-person.jsx', 'utf8').split('\n');
// Let's find exactly the block around line 217
let out = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  out.push(line);
  if (line.includes('                          </div>') && lines[i+1] && lines[i+1].includes('                        </div>') && lines[i+2] && lines[i+2].includes('                      );')) {
    // Check if it's missing the closing `)}`
    if (!line.includes(')}')) {
      out.pop();
      out.push('                          </div>');
      out.push('                        )}');
    }
  }
}
fs.writeFileSync('src/jsx/tab-person.jsx', out.join('\n'));
