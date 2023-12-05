import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');

const numberOnlyInput = input.replace(/[a-z]/gi, '').split('\n');

const total = numberOnlyInput.reduce((agg, numbers) => {
  if (numbers.length === 0) {
    return agg;
  }

  // if (numbers.length === 1) {
  //   return parseInt(numbers[0]+numbers[0], 10) + agg;
  // }

  return parseInt(numbers[0] + numbers[numbers.length - 1], 10) + agg;
}, 0);

console.log({ total });
