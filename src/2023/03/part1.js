import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const lines = input.split('\n').filter(Boolean);

const grid = [];
const values = [];

const isNumber = (char) => /\d/.test(char);
const isSymbol = (char) => /[^0-9.]/.test(char);

function checkForAdjacentSymbol(x, y) {
  // check left
  if (x - 1 >= 0 && isSymbol(grid[y][x - 1])) return true;

  // check right
  if (x + 1 < grid[y].length && isSymbol(grid[y][x + 1])) return true;

  // check up
  if (y - 1 >= 0 && isSymbol(grid[y - 1][x])) return true;

  // check down
  if (y + 1 < grid.length && isSymbol(grid[y + 1][x])) return true;

  // check up-left
  if (y - 1 >= 0 && x - 1 >= 0 && isSymbol(grid[y - 1][x - 1])) return true;

  // check up-right
  if (y - 1 >= 0 && x + 1 < grid[y].length && isSymbol(grid[y - 1][x + 1])) return true;

  // check down-left
  if (y + 1 < grid.length && x - 1 >= 0 && isSymbol(grid[y + 1][x - 1])) return true;

  // check down-right
  if (y + 1 < grid.length && x + 1 < grid[y].length && isSymbol(grid[y + 1][x + 1])) return true;

  return false;
}

// create grid
lines.forEach((line) => {
  grid.push(line.split(''));
});

// walk grid to find matches
for (let y = 0; y < lines.length; y += 1) {
  const line = lines[y];

  for (let x = 0; x < line.length; x += 1) {
    const char = line[x];
    // eslint-disable-next-line no-continue
    if (!isNumber(char)) continue;

    let number = '';
    let isSymbolAdjacent = false;

    // capture length of number
    while (isNumber(line[x])) {
      number += line[x];

      if (!isSymbolAdjacent) {
        isSymbolAdjacent = checkForAdjacentSymbol(x, y);
      }

      x += 1;
    }

    // push if we encountered a symbol near the number
    if (isSymbolAdjacent) {
      values.push(parseInt(number, 10));
    }
  }
}

const total = values.reduce((acc, val) => acc + val, 0);
console.log({ total });
