const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const targetUnionEnd = `                        ))}
                      </div>
                    </div>
                  );`;
                  
const replaceUnionEnd = `                        ))}
                      </div>
                      {window.latestUnionAI && (
                        <div className="mt-6 bg-[#121426] p-6 rounded-2xl border border-[#27272a]">
                          <div className="text-xs text-amber-500 uppercase font-mono mb-2 tracking-widest border-b border-amber-500/20 pb-2">AI Sage Relationship Analysis</div>
                          <div className="text-xs text-white/80 leading-relaxed font-mono whitespace-pre-wrap">{window.latestUnionAI}</div>
                        </div>
                      )}
                    </div>
                  );`;

c = c.replace(targetUnionEnd, replaceUnionEnd);

fs.writeFileSync('src/jsx/pdf-report.jsx', c);
