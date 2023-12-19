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

const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input3_pt2.txt', import.meta.url);
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

// create a copy of the map with '.' and then replace with path it's navigated
const tunnelMapCopy = tunnelMap.map((row) => Array(row.length).fill('.'));
let coords = [];

// replace tunnelMapCopy starting position 'S' with correct pipe
Object.entries(pipeMovement).forEach(([pipe, moves]) => {
  if (startingMovements.includes(moves[0]) && startingMovements.includes(moves[1])) {
    tunnelMapCopy[startPos[1]][startPos[0]] = pipe;
  }
});

// perform valid starting movements
startingMovements.forEach((dir) => {
  const nextMove = getNextMove(startPos, dir);
  coords.push(nextMove);
});

// walk path loop until we hit the same point
do {
  const newCoords = [];
  for (let i = 0; i < coords.length; i += 1) {
    const { nextPos: currPos, nextMove: dir } = coords[i];
    const [cx, cy, cChar] = currPos;
    tunnelMapCopy[cy][cx] = cChar;
    const nextMove = getNextMove(currPos, dir);
    newCoords.push(nextMove);
  }

  coords = newCoords;
} while ((coords[0].nextPos[0] === coords[1].nextPos[0] && coords[0].nextPos[1] === coords[1].nextPos[1]) === false);

// write out final char
const [fx, fy, fChar] = coords[0].nextPos;
tunnelMapCopy[fy][fx] = fChar;

let insideLoopCount = 0;

/**
 * Point in Polygon algorithm (Ray casting algorithm)
 * @see https://en.wikipedia.org/wiki/Point_in_polygon
 */
for (let y = 0; y < tunnelMapCopy.length; y += 1) {
  const row = tunnelMapCopy[y];
  let x = 0;

  do {
    if (row[x] === '.') {
      let intersections = 0;
      let walkX = x;
      while (walkX > 0) {
        walkX -= 1;
        // only need to track one pair of same direction pipes to find intersections
        if (['|', 'F', '7'].includes(row[walkX])) {
          if (x === 19 && y === 3) {
            console.log({ char: row[walkX] });
          }
          intersections += 1;
        }
      }

      if (intersections % 2 === 1) {
        insideLoopCount += 1;
        row[x] = 'X';
      }
    }

    x += 1;
  } while (x < row.length);
}

fs.writeFileSync('output.txt', tunnelMapCopy.map((row) => row.join('')).join('\n'));
console.log({ insideLoopCount });
