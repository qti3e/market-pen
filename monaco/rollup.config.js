import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import * as path from 'path';

const entries = [
  {
    dir: path.join(__dirname, './'),
    file: 'monaco',
  },
  {
    dir: path.join(__dirname, '../node_modules/monaco-editor/esm/vs/language/typescript/'),
    file: 'ts.worker',
  },
  {
    dir: path.join(__dirname, '../node_modules/monaco-editor/esm/vs/editor/'),
    file: 'editor.worker'
  }
]

export default entries.map(({dir, file}) => ({
  input: `${dir}${file}.js`,
  output: [
    {
      format: file === 'monaco' ? 'es' : 'iife',
      file: path.join(__dirname, `../public/monaco/${file}.bundle.js`),
      name: file === 'monaco' ? file : file.slice(0, file.indexOf('.')),
      sourcemap: true,
      inlineDynamicImports: true
    }
  ],
  plugins: [
    postcss({
        extract: `${file}-style.css`,
        sourceMap: true,
        minimize: true
    }),
    resolve({
      browser: true
    }),
    commonjs(),
    terser()
  ]
}));
