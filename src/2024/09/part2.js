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

let end = fileBlocks.length - 1;

for (let i = end; i > 0; i -= 1) {
  const block = fileBlocks[i];

  if (block === '.') {
    continue;
  }

  let count = 1;
  while (block === fileBlocks[i - 1]) {
    count += 1;
    i -= 1;
  }

  let dotCount = 0;
  let dotEnd = 0;
  while (dotEnd < i && dotCount < count) {
    dotCount = fileBlocks[dotEnd] === '.' ? dotCount + 1 : 0;
    dotEnd += 1;
  }

  // we have space to swap
  if (dotCount === count) {
    let dotStart = dotEnd - dotCount;
    let blockEnd = i + count;

    for (let swapCount = 0; swapCount < count; swapCount += 1) {
      // swap
      fileBlocks[dotStart] = fileBlocks[i];
      fileBlocks[blockEnd - 1] = '.';

      dotStart += 1;
      blockEnd -= 1;
    }
  }

  // reset count
  count = 0;
}

let total = 0;
for (let i = 0; i < fileBlocks.length; i += 1) {
  const block = fileBlocks[i];
  if (block === '.') {
    continue;
  }

  total += i * fileBlocks[i];
}

console.log({ total });
