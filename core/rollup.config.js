import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import * as path from 'path';

export default {
  input: path.resolve(__dirname, 'sandbox.ts'),
  output: [
    {
      format: 'iife',
      file: path.join(__dirname, `../public/sandbox/sandbox.js`),
      name: 'sandbox',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    terser(),
  ],
};
