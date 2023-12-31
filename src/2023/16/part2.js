import fs from 'fs';

function createMovement(board) {
  return {
    left: (x, y) => (x - 1 >= 0 ? [x - 1, y, board[y][x - 1]] : undefined),
    right: (x, y) => (x + 1 < board[y].length ? [x + 1, y, board[y][x + 1]] : undefined),
    up: (x, y) => (y - 1 >= 0 ? [x, y - 1, board[y - 1][x]] : undefined),
    down: (x, y) => (y + 1 < board.length ? [x, y + 1, board[y + 1][x]] : undefined),
  };
}

function determineMoves(char, direction) {
  if (char === '|' && ['right', 'left'].includes(direction)) {
    return ['up', 'down'];
  }

  if (char === '-' && ['up', 'down'].includes(direction)) {
    return ['left', 'right'];
  }

  if ((char === '\\' && direction === 'right') || (char === '/' && direction === 'left')) {
    return ['down'];
  }

  if ((char === '\\' && direction === 'left') || (char === '/' && direction === 'right')) {
    return ['up'];
  }

  if ((char === '\\' && direction === 'up') || (char === '/' && direction === 'down')) {
    return ['left'];
  }

  if ((char === '\\' && direction === 'down') || (char === '/' && direction === 'up')) {
    return ['right'];
  }

  return [direction];
}

function getEnergizedTiles(sX, sY, sDir, grid) {
  const movement = createMovement(grid);
  const energizedTiles = [];
  const uniqueEnergizedTiles = new Set();
  const moves = [[sX, sY, sDir, {}]];

  while (moves.length) {
    const [x, y, direction, tilesSeen] = moves.shift();

    if (x === undefined || y === undefined) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const char = grid[y][x];

    energizedTiles.push([x, y, direction]);
    uniqueEnergizedTiles.add(`${x},${y}`);
    tilesSeen[`${x}|${y}|${direction}`] = tilesSeen[`${x}|${y}|${direction}`] + 1 || 1;

    const nextMoves = determineMoves(char, direction);
    nextMoves.forEach((move) => {
      const [nX, nY] = movement[move](x, y) || [undefined, undefined, undefined];

      if (tilesSeen[`${x}|${y}|${direction}`] < 2) {
        moves.push([nX, nY, move, tilesSeen]);
      }
    });
  }

  return uniqueEnergizedTiles.size;
}

const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const grid = input
  .split('\n')
  .filter(Boolean)
  .map((row) => row.split(''));

let mostEnergizedTiles = 0;

for (let y = 0; y < grid.length; y += 1) {
  for (let x = 0; x < grid[y].length; x += 1) {
    const topSide = getEnergizedTiles(x, y, 'down', grid);
    const bottomSide = getEnergizedTiles(x, grid.length - 1, 'up', grid);
    mostEnergizedTiles = Math.max(topSide, bottomSide, mostEnergizedTiles);
  }

  const leftSide = getEnergizedTiles(0, y, 'right', grid);
  const rightSide = getEnergizedTiles(grid[y].length - 1, y, 'left', grid);
  mostEnergizedTiles = Math.max(leftSide, rightSide, mostEnergizedTiles);
}

console.log({ total: mostEnergizedTiles });
