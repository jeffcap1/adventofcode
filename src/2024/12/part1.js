import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example1.txt');
// const inputFile = path.join(path.resolve(), 'puzzle-input/example2.txt');
// const inputFile = path.join(path.resolve(), 'puzzle-input/example3.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const garden = input
  .split('\n')
  .filter(Boolean)
  .map((r) => r.split(''));

const mapHeight = garden.length - 1;
const mapWidth = garden[0].length - 1;

const move = {
  d: (x, y) => [x, y + 1],
  u: (x, y) => [x, y - 1],
  l: (x, y) => [x - 1, y],
  r: (x, y) => [x + 1, y],
};
const directions = Object.keys(move);

const seen = {};
const points = [[0, 0]];

const isValidSpace = (x, y) => x >= 0 && x <= mapWidth && y >= 0 && y <= mapHeight;

while (points.length > 0) {
  const [x, y] = points.shift();
  const letter = garden[y][x];

  if (!seen[letter]) {
    seen[letter] = {
      coords: new Set(),
      groups: [],
    };
  }

  // already seen this so continue
  if (seen[letter].coords.has(`${x}|${y}`)) {
    continue;
  }

  // track that we've seen this point
  seen[letter].coords.add(`${x}|${y}`);

  // track results
  const currentGroup = {
    perimeter: 0,
    area: 1,
    coords: new Set(),
  };

  // look around
  for (let i = 0; i < directions.length; i += 1) {
    const dir = directions[i];
    const [nx, ny] = move[dir](x, y);

    // OOB which is a perimeter
    if (!isValidSpace(nx, ny)) {
      currentGroup.perimeter += 1;
      continue;
    }

    const nextLetter = garden[ny][nx];

    // if we are here then its a different letter
    if (nextLetter !== letter) {
      // pushing onto point stack and increasing perimeter count
      points.push([nx, ny]);
      currentGroup.perimeter += 1;
      continue;
    }

    // Depth search on same letter
    const groupPoints = [[nx, ny]];
    while (groupPoints.length > 0) {
      // add to coords
      const [gx, gy] = groupPoints.shift();

      // make sure we haven't tracked this already
      if (seen[letter].coords.has(`${gx}|${gy}`)) {
        continue;
      }

      seen[letter].coords.add(`${gx}|${gy}`);

      // add to group
      currentGroup.area += 1;
      currentGroup.coords.add(`${gx}|${gy}`);

      // look around
      for (let i = 0; i < directions.length; i += 1) {
        const dir = directions[i];
        const [gnx, gny] = move[dir](gx, gy);

        // OOB which is a perimeter
        if (!isValidSpace(gnx, gny)) {
          currentGroup.perimeter += 1;
          continue;
        }

        const nextLetter = garden[gny][gnx];

        // if we are here then its a different letter
        if (nextLetter !== letter) {
          // pushing onto point stack and increasing perimeter count
          points.push([gnx, gny]);
          currentGroup.perimeter += 1;
          continue;
        }

        if (currentGroup.coords.has(`${gnx}|${gny}`)) {
          continue;
        }

        // found another spot
        groupPoints.push([gnx, gny]);
      }
    }
  }

  seen[letter].groups.push(currentGroup);
}

let total = 0;

Object.values(seen).forEach((letter) => {
  letter.groups.forEach((group) => {
    total += group.area * group.perimeter;
  });
});

console.log({ total });
