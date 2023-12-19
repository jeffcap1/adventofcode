import fs from 'fs';

function createMovement(board) {
  return {
    left: (x, y) => (x - 1 >= 0 ? [x - 1, y, board[y][x - 1]] : undefined),
    right: (x, y) => (x + 1 < board[y].length ? [x + 1, y, board[y][x + 1]] : undefined),
    up: (x, y) => (y - 1 >= 0 ? [x, y - 1, board[y - 1][x]] : undefined),
    down: (x, y) => (y + 1 < board.length ? [x, y + 1, board[y + 1][x]] : undefined),
  };
}

function findStartingPoint(map) {
  for (let y = 0; y < map.length; y += 1) {
    const match = map[y].match(/S/);
    if (match) {
      return [match.index, y];
    }
  }
  return [0, 0];
}

function isValidStartMove(pos, dir, movement, pipeMovement) {
  const [cX, cY] = pos;
  const move = movement[dir](cX, cY);

  // oob, starting point, or not a pipe
  if (move === undefined || move[2] === 'S' || move[2] === '.') {
    return false;
  }

  const [nX, nY, nChar] = move;
  const nMove1 = movement[pipeMovement[nChar][0]](nX, nY);

  if (nMove1 !== undefined && nMove1[0] === cX && nMove1[1] === cY) {
    return true;
  }

  const nMove2 = movement[pipeMovement[nChar][1]](nX, nY);
  if (nMove2 !== undefined && nMove2[0] === cX && nMove2[1] === cY) {
    return true;
  }

  return false;
}

function createGetNextMove(movement, pipeMovement) {
  function isValidMove(pos, prevPos, moves) {
    const [px, py] = prevPos;
    const nextPosition1 = movement[moves[0]](...pos);

    // oob, start point, or not a pipe
    if (nextPosition1 === undefined || nextPosition1[2] === '.' || nextPosition1[2] === 'S') {
      return false;
    }

    // choose the move that will move forward
    return (nextPosition1[0] === px && nextPosition1[1] === py) === false;
  }

  return function getNextMove(currPos, dir) {
    const [cx, cy] = currPos;
    const nextPos = movement[dir](cx, cy);
    const nextMoves = pipeMovement[nextPos[2]];
    const nextMove = pipeMovement[nextPos[2]][isValidMove(nextPos, currPos, nextMoves) ? 0 : 1];
    return { nextPos, nextMove };
  };
}

// read input file
const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
// const file = new URL('small_input4.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const tunnelMapRows = input.split('\n').filter(Boolean);
const tunnelMap = tunnelMapRows.map((row) => row.split(''));
const pipeMovement = {
  '|': ['up', 'down'],
  '-': ['left', 'right'],
  L: ['up', 'right'],
  J: ['up', 'left'],
  7: ['down', 'left'],
  F: ['down', 'right'],
};

const startPos = findStartingPoint(tunnelMapRows);
const movement = createMovement(tunnelMap);
const getNextMove = createGetNextMove(movement, pipeMovement);
const startingMovements = Object.keys(movement).filter((dir) =>
  isValidStartMove(startPos, dir, movement, pipeMovement)
);

let stepCount = 1;
let coords = [];

startingMovements.forEach((dir) => {
  const nextMove = getNextMove(startPos, dir);
  coords.push(nextMove);
});

// walk path loop until we hit the same point
do {
  stepCount += 1;

  const newCoords = [];
  for (let i = 0; i < coords.length; i += 1) {
    const { nextPos: currPos, nextMove: dir } = coords[i];
    const nextMove = getNextMove(currPos, dir);
    newCoords.push(nextMove);
  }

  coords = newCoords;
} while ((coords[0].nextPos[0] === coords[1].nextPos[0] && coords[0].nextPos[1] === coords[1].nextPos[1]) === false);

console.log({ stepCount });
