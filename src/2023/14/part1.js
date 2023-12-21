import fs from 'fs';

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const grid = input
  .split('\n')
  .filter(Boolean)
  .map((row) => row.split(''));

let total = 0;

for (let y = 0; y < grid.length; y += 1) {
  const row = grid[y];
  for (let x = 0; x < row.length; x += 1) {
    const char = row[x];
    // eslint-disable-next-line no-continue
    if (char !== 'O') continue;

    let newY = y - 1;
    let curY = y;
    while (grid[newY] !== undefined && grid[newY][x] === '.') {
      grid[newY][x] = 'O';
      grid[curY][x] = '.';
      newY -= 1;
      curY -= 1;
    }

    total += grid.length - curY;
  }
}

console.log({ total });
