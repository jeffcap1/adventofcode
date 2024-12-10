import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example1.txt');
// const inputFile = path.join(path.resolve(), 'puzzle-input/example2.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const diskMap = fs.readFileSync(inputFile, 'utf-8').replace('\n', '');

const fileBlocks = [];
let id = 0;

for (let i = 0; i < diskMap.length; i += 1) {
  const data = i % 2 === 0 ? id : '.';
  for (let j = 0; j < Number(diskMap[i]); j += 1) {
    fileBlocks.push(data);
  }
  if (i % 2) {
    id += 1;
  }
}

let e = fileBlocks.length - 1;

for (let i = 0; i < fileBlocks.length; i += 1) {
  if (fileBlocks[i] !== '.') {
    continue;
  }

  // stop running once indexes cross
  if (e <= i) {
    break;
  }

  fileBlocks[i] = fileBlocks[e];
  fileBlocks[e] = '.';
  e -= 1;
  while (fileBlocks[e] === '.') {
    e -= 1;
  }
}

let total = 0;
for (let i = 0; i < fileBlocks.length; i += 1) {
  if (fileBlocks[i] === '.') {
    break;
  }

  total += i * fileBlocks[i];
}

console.log({ total });
