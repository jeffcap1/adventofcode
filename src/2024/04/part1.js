import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const lines = input
  .split('\n')
  .filter(Boolean)
  .map((row) => row.split(''));

const found = [];
const word = 'XMAS';

const directions = {
  d: (x, y) => [x, y + 1],
  u: (x, y) => [x, y - 1],
  l: (x, y) => [x - 1, y],
  r: (x, y) => [x + 1, y],
  dl: (x, y) => [x - 1, y + 1],
  dr: (x, y) => [x + 1, y + 1],
  ul: (x, y) => [x - 1, y - 1],
  ur: (x, y) => [x + 1, y - 1],
};

lines.forEach((line, indexY) => {
  for (let i = 0; i < line.length; i += 1) {
    const letter = line[i];
    if (letter !== word[0]) {
      continue;
    }

    // we have a start
    Object.keys(directions).forEach((direction) => {
      let loop = 1;
      let pos = [i, indexY];
      const finding = [pos];

      while (loop < word.length) {
        const newCoords = directions[direction](pos[0], pos[1]);
        const currentLine = lines[newCoords[1]];
        const current = currentLine && currentLine[newCoords[0]];

        if (current !== word[loop]) {
          break;
        }

        finding.push({ newCoords, letter: current });
        pos = newCoords;
        loop += 1;
      }

      if (finding.length === word.length) {
        found.push(finding);
      }
    });
  }
});

console.log({ count: found.length });
