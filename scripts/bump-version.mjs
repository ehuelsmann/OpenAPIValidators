#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('Usage: node scripts/bump-version.mjs <new-version>');
  process.exit(1);
}

// repo root = parent of scripts/
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const packagesDir = path.join(repoRoot, 'packages');

if (!fs.existsSync(packagesDir)) {
  console.error(`Expected packages dir at: ${packagesDir}`);
  process.exit(1);
}

const packageDirs = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => path.join(packagesDir, d.name));

const packageJsonPaths = packageDirs
  .map((dir) => path.join(dir, 'package.json'))
  .filter((p) => fs.existsSync(p));

if (packageJsonPaths.length === 0) {
  console.error('No packages/*/package.json files found.');
  process.exit(1);
}

// collect internal package names
const internalNames = new Set();
for (const p of packageJsonPaths) {
  const j = readJson(p);
  if (j?.name) internalNames.add(j.name);
}

// bump versions + internal dependency ranges
let changed = 0;
for (const p of packageJsonPaths) {
  const j = readJson(p);
  const before = JSON.stringify(j);

  j.version = newVersion;

  const depBlocks = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ];
  for (const block of depBlocks) {
    if (!j[block]) continue;
    for (const dep of Object.keys(j[block])) {
      if (internalNames.has(dep)) {
        j[block][dep] = `^${newVersion}`;
      }
    }
  }

  if (JSON.stringify(j) !== before) {
    writeJson(p, j);
    changed++;
  }
}

console.log(`Bumped ${changed} package(s) to version ${newVersion}.`);
console.log(
  'Next steps: review git diff, commit, then create/push tag for your workflow.',
);
