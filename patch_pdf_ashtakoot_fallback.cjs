const fs = require('fs');
let c = fs.readFileSync('src/jsx/pdf-report.jsx', 'utf8');

const targetPdfAI = `{window.latestUnionAI && (
                        <div className="mt-6 bg-[#121426] p-6 rounded-2xl border border-[#27272a]">
                          <div className="text-xs text-amber-500 uppercase font-mono mb-2 tracking-widest border-b border-amber-500/20 pb-2">AI Sage Relationship Analysis</div>
                          <div className="text-xs text-white/80 leading-relaxed font-mono whitespace-pre-wrap">{window.latestUnionAI}</div>
                        </div>
                      )}`;

const replacePdfAI = `<div className="mt-6 bg-[#121426] p-6 rounded-2xl border border-[#27272a]">
                          <div className="text-xs text-amber-500 uppercase font-mono mb-2 tracking-widest border-b border-amber-500/20 pb-2">Vedic Synthesis</div>
                          <div className="text-xs text-white/80 leading-relaxed font-mono whitespace-pre-wrap">
                            {window.latestUnionAI || \`The Ashtakoot score of \${ashtakoot.score}/36 indicates \${ashtakoot.score >= 28 ? "an exceptionally strong energetic alignment, bringing mutual prosperity and understanding." : ashtakoot.score >= 18 ? "a moderate alignment that will require conscious communication and patience, but is fundamentally workable." : "a challenging dynamic that requires deliberate effort to maintain harmony and balance."} Based on the individual component scores above, you must prioritize addressing areas with the lowest compatibility ratings by practicing empathy and implementing practical remedies.\`}
                          </div>
                        </div>`;

c = c.replace(targetPdfAI, replacePdfAI);
fs.writeFileSync('src/jsx/pdf-report.jsx', c);
