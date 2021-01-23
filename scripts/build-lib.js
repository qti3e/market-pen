const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const cwd = path.join(__dirname, '..');
const out = path.join(__dirname, '../public/sandbox/lib.d.ts');
const input = path.join(__dirname, '../core/runtime.d.ts');

spawnSync('rm', ['-rf', 'build'], {
  cwd: path.join(__dirname, '../core'),
});

spawnSync('npx', ['tsc'], {
  cwd: path.join(__dirname, '../core'),
});

spawnSync('npx', ['dts-bundle-generator', '-o', out, input], {
  cwd,
});

fs.writeFileSync(
  out,
  fs
    .readFileSync(out, 'utf-8')
    .split(/\r?\n/g)
    .map((line) => {
      const trimmed = line.trimStart();
      const spaces = line.slice(0, line.length - trimmed.length);

      if (trimmed.startsWith('export ')) {
        if (trimmed[7] === '{') return null;
        return spaces + trimmed.slice(7);
      }

      if (trimmed.startsWith('declare abstract class')) {
        return spaces + 'interface' + trimmed.slice(22);
      }

      if (trimmed.startsWith('declare class')) {
        return spaces + 'interface' + trimmed.slice(13);
      }

      if (trimmed.startsWith('declare type')) {
        return spaces + trimmed.slice(8);
      }

      if (
        trimmed.startsWith('constructor') ||
        trimmed.startsWith('protected') ||
        trimmed.startsWith('private')
      ) {
        return null;
      }

      if (trimmed.startsWith('get ')) {
        const i = trimmed.indexOf('(');
        const j = trimmed.indexOf(')');
        if (i < 0 || j < 0) throw new Error('');
        return spaces + 'readonly ' + trimmed.slice(4, i) + trimmed.slice(j + 1);
      }

      return line;
    })
    .filter((x) => x !== null)
    .join('\n')
);
