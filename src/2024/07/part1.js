import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const rows = input.split('\n').filter(Boolean);
const ops = {
  '*': (a, b) => Number(a) * Number(b),
  '+': (a, b) => Number(a) + Number(b),
};

const goodTotals = [];

for (let i = 0; i < rows.length; i += 1) {
  const row = rows[i];
  const [totalStr, numberStr] = row.split(': ');
  const numbers = numberStr.split(' ');
  const total = Number(totalStr);

  let n = 1;
  let run = [numbers[0]];

  // while we have not reached total or exhausted numbers, loop!
  while (n < numbers.length && run.length > 0) {
    const newNums = [];
    const num = numbers[n];

    for (let i = 0; i < run.length; i += 1) {
      const add = ops['+'](run[i], num);
      const mul = ops['*'](run[i], num);

      if (add <= total) {
        newNums.push(add);
      }

      if (mul <= total) {
        newNums.push(mul);
      }
    }

    // update running numbers
    run = newNums;
    n += 1;
  }

  const goodNumbers = run.filter((r) => total === r);
  if (goodNumbers.length > 0) {
    goodTotals.push(total);
  }
}

const total = goodTotals.reduce((cur, acc) => cur + acc, 0);
console.log({ total });
