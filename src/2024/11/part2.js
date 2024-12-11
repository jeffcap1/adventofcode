import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example1.txt');
// const inputFile = path.join(path.resolve(), 'puzzle-input/example2.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8').replace(/\n/g, '');

// const totalBlinks = 1;
// const totalBlinks = 6;
const totalBlinks = 75;

let stones = input.split(' ').map((s) => [s, 1]);

const cache = new Map();

function rules(stone) {
  if (cache.has(stone)) {
    return cache.get(stone);
  }

  // equal 0
  if (stone === '0') {
    cache.set(stone, ['1']);
    return ['1'];
  }

  // even
  if (stone.length % 2 == 0) {
    const stoneRightArr = stone.split('');
    const stoneLeftArr = stoneRightArr.splice(0, Math.floor(stone.length / 2));
    const stoneLeft = stoneLeftArr.join('').replace(/^0+/g, '').length > 0 ? stoneLeftArr.join('').replace(/^0+/g, '') : '0';
    const stoneRight = stoneRightArr.join('').replace(/^0+/g, '').length > 0 ? stoneRightArr.join('').replace(/^0+/g, '') : '0';
    cache.set(stone, [stoneLeft, stoneRight]);
    return [stoneLeft, stoneRight];
  }

  const newStone = Number(stone) * 2024;
  cache.set(stone, [`${newStone}`]);
  return [`${newStone}`];
}

for (let blinks = 0; blinks < totalBlinks; blinks += 1) {
  const newStones = [];
  const stoneGroupings = new Map();

  for (let i = 0; i < stones.length; i += 1) {
    const [stone, number] = stones[i];

    if (stoneGroupings.has(stone)) {
      stoneGroupings.set(stone, stoneGroupings.get(stone) + number);
      continue;
    }

    stoneGroupings.set(stone, number);
  }

  stoneGroupings.forEach((number, stone) => {
    const updatedStones = rules(stone);
    updatedStones.forEach((s) => newStones.push([s, number]));
  });

  stones = newStones;
}

console.log(`________________________________________________`);
console.log(`total stones: ${stones.reduce((acc, curr) => acc + curr[1], 0)}`);
