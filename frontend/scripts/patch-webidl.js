import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const target = resolve('node_modules/webidl-conversions/lib/index.js');
const original = readFileSync(target, 'utf8');
const updated = original.replace(
  "else if (x === -0) { // don't return negative zero",
  "else if (Object.is(x, -0)) { // don't return negative zero",
);

if (original !== updated) {
  writeFileSync(target, updated);
}
