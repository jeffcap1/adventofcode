import fs from 'fs';

function moveNorth(grid) {
  const gridCopy = grid;

  for (let y = 0; y < gridCopy.length; y += 1) {
    const row = gridCopy[y];
    for (let x = 0; x < row.length; x += 1) {
      const char = row[x];
      // eslint-disable-next-line no-continue
      if (char !== 'O') continue;

      let newY = y - 1;
      let curY = y;
      while (gridCopy[newY] !== undefined && gridCopy[newY][x] === '.') {
        gridCopy[newY][x] = 'O';
        gridCopy[curY][x] = '.';
        newY -= 1;
        curY -= 1;
      }
    }
  }

  return gridCopy;
}

function moveSouth(grid) {
  const gridCopy = grid;

  for (let y = gridCopy.length - 1; y >= 0; y -= 1) {
    const row = gridCopy[y];
    for (let x = 0; x < row.length; x += 1) {
      const char = row[x];
      // eslint-disable-next-line no-continue
      if (char !== 'O') continue;

      let newY = y + 1;
      let curY = y;
      while (gridCopy[newY] !== undefined && gridCopy[newY][x] === '.') {
        gridCopy[newY][x] = 'O';
        gridCopy[curY][x] = '.';
        newY += 1;
        curY += 1;
      }
    }
  }

  return gridCopy;
}

function moveEast(grid) {
  const gridCopy = grid;

  for (let y = 0; y < gridCopy.length; y += 1) {
    const row = gridCopy[y];
    for (let x = row.length - 1; x >= 0; x -= 1) {
      const char = row[x];
      // eslint-disable-next-line no-continue
      if (char !== 'O') continue;

      let newX = x + 1;
      let curX = x;
      while (gridCopy[y][newX] !== undefined && gridCopy[y][newX] === '.') {
        gridCopy[y][newX] = 'O';
        gridCopy[y][curX] = '.';
        newX += 1;
        curX += 1;
      }
    }
  }

  return gridCopy;
}

function moveWest(grid) {
  const gridCopy = grid;

  for (let y = 0; y < gridCopy.length; y += 1) {
    const row = gridCopy[y];
    for (let x = 0; x < row.length; x += 1) {
      const char = row[x];
      // eslint-disable-next-line no-continue
      if (char !== 'O') continue;

      let newX = x - 1;
      let curX = x;
      while (gridCopy[y][newX] !== undefined && gridCopy[y][newX] === '.') {
        gridCopy[y][newX] = 'O';
        gridCopy[y][curX] = '.';
        newX -= 1;
        curX -= 1;
      }
    }
  }

  return gridCopy;
}

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
let grid = input.split('\n').filter(Boolean);

const startingGrid = [...grid].map((row) => row.split(''));
grid = grid.map((row) => row.split(''));

let prevTotal;
let total = 0;
const totalCycles = 1000000000;
const totals = [];
const patternMap = {};
const possiblePatternStart = {};
let patternStartIndex = 0;
let cycleLength = 0;

let i = 0;
do {
  i += 1;
  prevTotal = total;
  total = 0;

  grid = moveNorth(grid);
  grid = moveWest(grid);
  grid = moveSouth(grid);
  grid = moveEast(grid);

  // find total after cyclce has completed
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] === 'O') {
        total += grid.length - y;
      }
    }
  }

  // store prev and current total as a key and count to find a pattern once it starts incrementing
  const key = `${prevTotal}|${total}`;
  patternMap[key] = patternMap[key] !== undefined ? patternMap[key] + 1 : 0;

  if (patternMap[key] === 1) {
    possiblePatternStart[key] = i;
  }

  if (patternMap[key] === 2) {
    cycleLength = i - possiblePatternStart[key];
    patternStartIndex = possiblePatternStart[key] - (cycleLength + 1);
    break;
  }

  totals.push(total);
} while (i < totalCycles && grid !== startingGrid);

const pattern = totals.slice(patternStartIndex, patternStartIndex + cycleLength);
const finalIndexInPattern = (totalCycles - patternStartIndex) % cycleLength;
const answer = pattern[finalIndexInPattern - 1];

console.log({ answer });
