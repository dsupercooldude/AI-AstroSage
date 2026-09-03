const fs = require('fs');
let c = fs.readFileSync('src/jsx/tab-union.jsx', 'utf8');

c = `const { useState, useEffect } = React;
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

` + c;

// let's do a more robust string replacement

fs.writeFileSync('src/jsx/tab-union.jsx', c);
