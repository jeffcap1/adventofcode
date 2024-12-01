import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
// const file = new URL('small_input2.txt', import.meta.url);
// const file = new URL('small_input3.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');

const directionInfo = input.replace('\n\n', '\n').split('\n');
const directions = directionInfo.shift().replace(/R/g, '1').replace(/L/g, '0').split('').map(Number);
const directionsMap = {};

function getLowestCommonMultiple(list) {
  function getGreatestCommonDivisor(a, b) {
    if (b === 0) return a;
    console.log({ a, b });
    return getGreatestCommonDivisor(b, a % b);
  }

  let res = list[0];

  for (let i = 1; i < list.length; i += 1) {
    console.log({ res, item: list[i] });
    res = (res * list[i]) / getGreatestCommonDivisor(res, list[i]);
    console.log({ res });
    console.log('---');
  }

  return res;
}

directionInfo.filter(Boolean).forEach((line) => {
  const lineInfo = line.replace(/[ ()]+/g, '').split('=');
  directionsMap[lineInfo[0]] = lineInfo[1].split(',');
});

// get starting position list
const directionsAList = Object.keys(directionsMap).filter((key) => key[key.length - 1] === 'A');
const stepsList = [];

// navigate map for each starting point
for (let i = 0; i < directionsAList.length; i += 1) {
  let endingLetter = '';
  let direction = directionsAList[i];
  let index = 0;
  let steps = 0;

  while (endingLetter !== 'Z') {
    const step = directions[index];
    direction = directionsMap[direction][step];
    endingLetter = direction[direction.length - 1];

    index += 1;
    steps += 1;

    if (index > directions.length - 1) {
      index = 0;
    }
  }

  stepsList.push(steps);
}

console.log({ stepsList });

const lcm = getLowestCommonMultiple(stepsList);
console.log({ lcm });
