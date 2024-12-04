import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const lines = input
  .split('\n')
  .filter(Boolean)
  .map((row) => row.split(''));

let found = 0;
const word = 'MAS';

const directions = {
  dl: (x, y) => [x - 1, y + 1],
  dr: (x, y) => [x + 1, y + 1],
  ul: (x, y) => [x - 1, y - 1],
  ur: (x, y) => [x + 1, y - 1],
};

// skip first and last rows as they won't work as a starting point
for (let y = 1; y < lines.length - 1; y += 1) {
  const line = lines[y];

  // skip first and last cols as they won't work as a starting point
  for (let x = 1; x < line.length - 1; x += 1) {
    const letter = line[x];
    if (letter !== 'A') {
      continue;
    }

    // we have a start
    const upperLeftCoords = directions.ul(x, y);
    const upperRightCoords = directions.ur(x, y);
    const downLeftCoords = directions.dl(x, y);
    const downRightCoords = directions.dr(x, y);

    const upperLeft = lines[upperLeftCoords[1]] && lines[upperLeftCoords[1]][upperLeftCoords[0]];
    const upperRight = lines[upperRightCoords[1]] && lines[upperRightCoords[1]][upperRightCoords[0]];
    const downLeft = lines[downLeftCoords[1]] && lines[downLeftCoords[1]][downLeftCoords[0]];
    const downRight = lines[downRightCoords[1]] && lines[downRightCoords[1]][downRightCoords[0]];

    // found match
    if (
      (`${upperLeft}A${downRight}` === word || `${downRight}A${upperLeft}` === word) &&
      (`${upperRight}A${downLeft}` === word || `${downLeft}A${upperRight}` === word)
    ) {
      found += 1;
    }
  }
}

console.log({ count: found });
