import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const lines = input.split('\n').filter(Boolean);

const grid = [];
const values = [];

const isNumber = (char) => /\d/.test(char);

function createMovement(board) {
  return {
    left: (x, y) => (x - 1 >= 0 ? [x - 1, y, board[y][x - 1]] : undefined),
    right: (x, y) => (x + 1 < board[y].length ? [x + 1, y, board[y][x + 1]] : undefined),
    up: (x, y) => (y - 1 >= 0 ? [x, y - 1, board[y - 1][x]] : undefined),
    down: (x, y) => (y + 1 < board.length ? [x, y + 1, board[y + 1][x]] : undefined),
    upLeft: (x, y) => (y - 1 >= 0 && x - 1 >= 0 ? [x - 1, y - 1, board[y - 1][x - 1]] : undefined),
    upRight: (x, y) => (y - 1 >= 0 && x + 1 < board[y].length ? [x + 1, y - 1, board[y - 1][x + 1]] : undefined),
    downLeft: (x, y) => (y + 1 < board.length && x - 1 >= 0 ? [x - 1, y + 1, board[y + 1][x - 1]] : undefined),
    downRight: (x, y) =>
      y + 1 < board.length && x + 1 < board[y].length ? [x + 1, y + 1, board[y + 1][x + 1]] : undefined,
  };
}

function getEntireNumber(line, x) {
  let number = '';
  let xRight = x;
  let xLeft = x - 1;

  // walk right
  while (isNumber(line[xRight])) {
    number += line[xRight];
    xRight += 1;
  }

  // walk left
  while (isNumber(line[xLeft])) {
    number = line[xLeft] + number;
    xLeft -= 1;
  }

  return number;
}

function getFullValue([charX, charY, char]) {
  if (!isNumber(char)) {
    return false;
  }

  const number = getEntireNumber(grid[charY], charX);
  return parseInt(number, 10);
}

// create grid
lines.forEach((line) => {
  grid.push(line.split(''));
});

const move = createMovement(grid);

// walk grid to find matches
for (let y = 0; y < lines.length; y += 1) {
  const line = lines[y];

  for (let x = 0; x < line.length; x += 1) {
    const char = line[x];
    // eslint-disable-next-line no-continue
    if (char !== '*') continue;

    const numbers = [];

    const leftValue = getFullValue(move.left(x, y));
    if (leftValue) numbers.push(leftValue);

    const rightValue = getFullValue(move.right(x, y));
    if (rightValue) numbers.push(rightValue);

    const upValue = getFullValue(move.up(x, y));
    if (upValue) numbers.push(upValue);

    const downValue = getFullValue(move.down(x, y));
    if (downValue) numbers.push(downValue);

    if (!upValue) {
      const upLeftValue = getFullValue(move.upLeft(x, y));
      if (upLeftValue) numbers.push(upLeftValue);

      const upRightValue = getFullValue(move.upRight(x, y));
      if (upRightValue) numbers.push(upRightValue);
    }

    if (!downValue) {
      const downLeftValue = getFullValue(move.downLeft(x, y));
      if (downLeftValue) numbers.push(downLeftValue);

      const downRightValue = getFullValue(move.downRight(x, y));
      if (downRightValue) numbers.push(downRightValue);
    }

    // if we have only two numbers, cell is valid multiply and push to values
    if (numbers.length === 2) {
      values.push(numbers[0] * numbers[1]);
    }
  }
}

const total = values.reduce((acc, val) => acc + val, 0);
console.log({ total });
