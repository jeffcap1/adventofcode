import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example1.txt');
// const inputFile = path.join(path.resolve(), 'puzzle-input/example2.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8').replace(/\n/g, '');

// const totalBlinks = 1;
// const totalBlinks = 6;
const totalBlinks = 25;

let stones = input.split(' ');

function rules(stone) {
  // equal 0
  if (stone === '0') {
    return ['1'];
  }

  // even
  if (stone.length % 2 == 0) {
    const stoneRightArr = stone.split('');
    const stoneLeftArr = stoneRightArr.splice(0, Math.floor(stone.length / 2));
    const stoneLeft = stoneLeftArr.join('').replace(/^0+/g, '').length > 0 ? stoneLeftArr.join('').replace(/^0+/g, '') : '0';
    const stoneRight = stoneRightArr.join('').replace(/^0+/g, '').length > 0 ? stoneRightArr.join('').replace(/^0+/g, '') : '0';
    return [stoneLeft, stoneRight];
  }

  const newStone = Number(stone) * 2024;
  return [`${newStone}`];
}

for (let blinks = 0; blinks < totalBlinks; blinks += 1) {
  const newStones = [];

  while (stones.length > 0) {
    const stone = stones.shift();
    const updatedStones = rules(stone);
    updatedStones.forEach((s) => newStones.push(s));
  }

  stones = newStones;
}

console.log(`________________________________________________`);
console.log(`total stones: ${stones.length}`);
