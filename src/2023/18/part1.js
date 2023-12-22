import fs from 'fs';

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const rows = input.split('\n').filter(Boolean);

const movement = {
  L: (x, y) => (x - 1 >= 0 ? [x - 1, y] : [undefined, y]),
  R: (x, y) => [x + 1, y],
  U: (x, y) => (y - 1 >= 0 ? [x, y - 1] : [x, undefined]),
  D: (x, y) => [x, y + 1],
};

let x = 250;
let y = 250;
let maxX = 0;
let minX = x;
let maxY = 0;
let minY = y;
let offsetY = 0;
let offsetX = 0;

const board = [];
const path = {};

// create path and store board size x,y
for (let i = 0; i < rows.length; i += 1) {
  const [direction, numberStr, color] = rows[i].split(' ');
  const number = parseInt(numberStr, 10);

  for (let j = 0; j < number; j += 1) {
    const [newX, newY] = movement[direction](x, y);
    if (newX !== undefined && newY !== undefined) {
      x = newX;
      y = newY;
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      path[`${x}|${y}`] = color;
    }
  }
}

offsetX = maxX - minX;
offsetY = maxY - minY;

// create board from path and x,y
for (let by = 0; by <= offsetY; by += 1) {
  for (let bx = 0; bx <= offsetX; bx += 1) {
    board[by] = board[by] || [];
    board[by][bx] = path[`${bx + minX}|${by + minY}`] ? '#' : '.';
  }
}

// fill shape
const coords = [[Math.floor(offsetY / 2), Math.floor(offsetX / 2)]]; // start in center

do {
  const [cy, cx] = coords.shift();

  Object.values(movement).forEach((move) => {
    const [mx, my] = move(cx, cy);
    if (board[my] !== undefined && board[my][mx] !== undefined && board[my][mx] !== '#') {
      path[`${mx + minX}|${my + minY}`] = '#';
      board[my][mx] = '#';
      coords.push([my, mx]);
    }
  });
} while (coords.length);

console.log(Object.keys(path).length);
fs.writeFileSync('output.txt', board.map((row) => row.join('')).join('\n'));