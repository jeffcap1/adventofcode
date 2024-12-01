import fs from 'fs';

function createMovement(board) {
  return {
    left: (x, y) => (x - 1 >= 0 ? [x - 1, y, board[y][x - 1]] : undefined),
    right: (x, y) => (x + 1 < board[y].length ? [x + 1, y, board[y][x + 1]] : undefined),
    up: (x, y) => (y - 1 >= 0 ? [x, y - 1, board[y - 1][x]] : undefined),
    down: (x, y) => (y + 1 < board.length ? [x, y + 1, board[y + 1][x]] : undefined),
  };
}

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const rows = input.split('\n').filter(Boolean);
const grid = rows.map((row) => row.split(''));

const movement = createMovement(grid);
const directions = Object.keys(movement);

// find S
let coords = new Map();
for (let y = 0; y < rows.length; y += 1) {
  if (rows[y].includes('S')) {
    const x = rows[y].indexOf('S');
    coords.set(`${x}|${y}`, [x, y]);
    break;
  }
}

let moves = 64;
while (moves > 0) {
  moves -= 1;
  const newCoords = new Map();
  coords.forEach((coord) => {
    const [x, y] = coord;

    directions.forEach((direction) => {
      const [newX, newY, symbol] = movement[direction](x, y) || [];
      if (newX !== undefined && newY !== undefined && symbol !== '#') {
        newCoords.set(`${newX}|${newY}`, [newX, newY]);
      }
    });
  });

  coords = newCoords;
}

console.log({ size: coords.size });
