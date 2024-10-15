import fs from 'fs';

// return x, y, symbol, board shift
function createMovement(board) {
  return {
    left: (x, y) => (x - 1 >= 0 ? [x - 1, y, board[y][x - 1], 0] : [board[y].length - 1, y, board[y][board[y].length - 1], -1]),
    right: (x, y) => (x + 1 < board[y].length ? [x + 1, y, board[y][x + 1], 0] : [0, y, board[y][0], 1]),
    up: (x, y) => (y - 1 >= 0 ? [x, y - 1, board[y - 1][x], 0] : [x, board.length - 1, board[board.length - 1][x], 1]),
    down: (x, y) => (y + 1 < board.length ? [x, y + 1, board[y + 1][x], 0] : [x, 0, board[0][x], -1]),
  };
}

// read input file
const file = new URL('small_input.txt', import.meta.url);
// const file = new URL('input.txt', import.meta.url);
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
    coords.set([x, y, 0].join('|'), [x, y, 0]);
    break;
  }
}

// find movements within a divisable number of moves
// const desiredMoves = 26501365;

const desiredMoves = 5000;
let moves = 0;
let minMoves = 50;

do {
  moves += 1;
  minMoves -= 1;
  const newCoords = new Map();
  coords.forEach((coord) => {
    const [x, y, b] = coord;

    directions.forEach((direction) => {
      const [newX, newY, symbol, boardShift] = movement[direction](x, y) || [];
      const newB = b + boardShift;

      if (boardShift !== 0) {
        console.log({ direction, x, y, b, newX, newY, newB, symbol, boardShift });
      }

      if (symbol !== '#') {
        newCoords.set([newB, newY, newX].join('|'), [newX, newY, newB]);
      }
    });
  });

  coords = newCoords;
  // if (moves % 10 === 0) {
  //   console.log({
  //     moves,
  //     size: coords.size,
  //     coords: [...coords].sort(),
  //   });
  // }
} while ((desiredMoves % moves !== 0 && minMoves <= 0) === false);

console.log({ moves, size: coords.size });
// console.log({ moves, size: coords.size, coords: [...coords.values().sort((a, b) => a[2] > b[2] && a[1] > b[1] && a[0] > b[0])] });

/*
    console.log({
      moves,
      size: coords.size,
      coords: [...coords.values()].sort((a, b) => {
        if (a[2] < b[2]) {
          return -1;
        }
        if (a[2] > b[2]) {
          return 1;
        }

        if (a[1] < b[1]) {
          return -1;
        }
        if (a[1] > b[1]) {
          return 1;
        }

        if (a[0] < b[0]) {
          return -1;
        }
        if (a[0] > b[0]) {
          return 1;
        }

        return 0;
      }),
    });
*/
