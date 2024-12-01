import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');
const input = fs.readFileSync(inputFile, 'utf-8');

const nLeft = [];
const nRight = new Map();

let total = 0;

input.split('\n').forEach((row) => {
  const parts = row.split(/ +/);

  if (parts.length < 2) {
    return;
  }

  nLeft.push(parts[0]);

  if (nRight.has(parts[1])) {
    nRight.set(parts[1], nRight.get(parts[1]) + 1);
    return;
  }

  nRight.set(parts[1], 1);
});

for (let i = 0; i < nLeft.length; i += 1) {
  const multiplier = nRight.get(nLeft[i]) || 0;
  total += Number(nLeft[i]) * multiplier;
}

console.log(`total is: ${total}`);
