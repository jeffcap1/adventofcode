import fs from 'fs';

// read input file
// const file = new URL('input.txt', import.meta.url);
const file = new URL('small_input.txt', import.meta.url);
// const file = new URL('small_input2.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');

const directionInfo = input.replace('\n\n', '\n').split('\n');
const directions = directionInfo.shift().replace(/R/g, '1').replace(/L/g, '0').split('').map(Number);
const directionsMap = {};
directionInfo.filter(Boolean).forEach((line) => {
  const lineInfo = line.replace(/[ ()]+/g, '').split('=');
  directionsMap[lineInfo[0]] = lineInfo[1].split(',');
});

let direction = 'AAA';
let index = 0;
let steps = 0;

while (direction !== 'ZZZ') {
  const step = directions[index];
  direction = directionsMap[direction][step];
  index += 1;
  steps += 1;

  if (index > directions.length - 1) {
    index = 0;
  }
}

console.log({ steps });
