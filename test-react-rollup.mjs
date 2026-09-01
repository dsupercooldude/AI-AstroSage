import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';

const code = `
import * as React from 'react';
console.log(React.Component);
`;
fs.writeFileSync('in.js', code);

(async () => {
  const bundle = await rollup({
    input: 'in.js',
    plugins: [resolve(), commonjs()]
  });
  const { output } = await bundle.generate({ format: 'es' });
  console.log(output[0].code);
})();
