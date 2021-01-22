const path = require("path");
const fs = require("fs");
const { spawnSync } = require('child_process');

const cwd = path.join(__dirname, "..");
const out = path.join(__dirname, "../public/sandbox/lib.d.ts");
const input = path.join(__dirname, "../core/runtime.d.ts");

spawnSync("rm", ["-rf", "build"], {
  cwd: path.join(__dirname, "../core")
});

spawnSync("npx", ["tsc"], {
  cwd: path.join(__dirname, "../core")
});

spawnSync("npx", ["dts-bundle-generator", "-o", out, input], {
  cwd
});

fs.writeFileSync(out, fs.readFileSync(out, "utf-8").split(/\r?\n/g).map(line => {
  const trimmed = line.trimStart();
  if (!trimmed.startsWith("export ")) return line;
  if (trimmed[7] === '{') return '';
  const spaces = line.slice(0, line.length - trimmed.length);
  return spaces + trimmed.slice(7);
}).join("\n"));

