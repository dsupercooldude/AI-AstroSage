import './src/init.ts';
import './src/js/formulas.js';
const p = window.calculatePanchang(new Date(), 28.6139, 77.2090, 5.5, "amanta");
console.log(p.masa, p.tithi, p.paksha);
