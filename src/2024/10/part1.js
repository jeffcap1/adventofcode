import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example1.txt');
// const inputFile = path.join(path.resolve(), 'puzzle-input/example2.txt');
// const inputFile = path.join(path.resolve(), 'puzzle-input/example3.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const trailMap = input
  .split('\n')
  .filter(Boolean)
  .map((r) => r.split(''));

const mapHeight = trailMap.length - 1;
const mapWidth = trailMap[0].length - 1;

const move = {
  d: (x, y) => [x, y + 1],
  u: (x, y) => [x, y - 1],
  l: (x, y) => [x - 1, y],
  r: (x, y) => [x + 1, y],
};
const directions = Object.keys(move);

function isValidSpace(x, y) {
  if (x >= 0 && x <= mapWidth && y >= 0 && y <= mapHeight) {
    return true;
  }
  return false;
}

const trailheads = [];
for (let y = 0; y < trailMap.length; y += 1) {
  for (let x = 0; x < trailMap[y].length; x += 1) {
    if (trailMap[y][x] === '0') {
      trailheads.push([x, y]);
    }
  }
}

let allTrailsCount = 0;

for (let i = 0; i < trailheads.length; i += 1) {
  const seen = new Set();
  const trails = [trailheads[i]];

  while (trails.length > 0) {
    const [x, y] = trails.pop();

    // get directions
    for (let direction of directions) {
      const [nx, ny] = move[direction](x, y);

      if (!isValidSpace(nx, ny)) {
        continue;
      }

      if (seen.has(`${nx},${ny}`)) {
        continue;
      }

      // does it increase by 1
      if (Number(trailMap[ny][nx]) - Number(trailMap[y][x]) !== 1) {
        continue;
      }

      // is it a 9?
      if (Number(trailMap[ny][nx]) === 9) {
        seen.add(`${nx},${ny}`);
        allTrailsCount += 1;
        continue;
      }

      seen.add(`${nx},${ny}`);
      trails.unshift([nx, ny]);
    }
  }
}

console.log({ total: allTrailsCount });
