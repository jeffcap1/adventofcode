import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const rows = input.split('\n').filter(Boolean);

const degreeToDirection = {
  0: 'u',
  90: 'r',
  180: 'd',
  270: 'l',
};

const arrowToDegree = {
  '^': 0,
  '>': 90,
  v: 180,
  '<': 270,
};

const directions = {
  d: (x, y) => [x, y + 1],
  u: (x, y) => [x, y - 1],
  l: (x, y) => [x - 1, y],
  r: (x, y) => [x + 1, y],
};

const seen = new Set();
let direction;
let current = { x: null, y: null };
let boardHeight = rows.length - 1;
let boardWidth;

const startRegex = /[<^>v]/;

// find start x,y
for (let y = 0; y < rows.length; y += 1) {
  const match = rows[y].match(startRegex);
  boardWidth = rows[y].length;
  if (match) {
    current = { x: match.index, y };
    direction = arrowToDegree[rows[y][match.index]];
    seen.add(`${match.index}|${y}`);
  }
}

// while loop to walk the path from start
while (current.x >= 0 && current.x <= boardWidth && current.y >= 0 && current.y <= boardHeight) {
  let nextPosition = directions[degreeToDirection[direction]](current.x, current.y);
  if (nextPosition[0] < 0 || nextPosition[0] > boardWidth || nextPosition[1] < 0 || nextPosition[1] > boardHeight) {
    break;
  }
  const nextChar = rows[nextPosition[1]][nextPosition[0]];

  if (nextChar === '#') {
    direction = direction + 90 < 360 ? direction + 90 : 0;
    nextPosition = directions[degreeToDirection[direction]](current.x, current.y);
  }

  seen.add(`${nextPosition[0]}|${[nextPosition[1]]}`);
  current.x = nextPosition[0];
  current.y = nextPosition[1];
}

console.log(seen.size);
