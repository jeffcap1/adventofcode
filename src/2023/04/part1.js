/**
 * correct answer 21,105
 */

import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const lines = input.split('\n').filter(Boolean);

const values = [];

const regex = / +/;

lines.forEach((line) => {
  const matches = [];
  const [cardWinningNumbers, cardGameNumbers] = line.replace(/^.+: /, '').split(' | ');
  const winningNumbers = cardWinningNumbers
    .trim()
    .split(regex)
    .map((number) => parseInt(number, 10));

  cardGameNumbers
    .trim()
    .split(regex)
    .forEach((cardNumber) => {
      const number = parseInt(cardNumber, 10);

      if (winningNumbers.includes(number)) {
        matches.push(number);
      }
    });

  if (matches.length === 0) {
    return 0;
  }

  if (matches.length === 1) {
    return values.push(1);
  }

  let doubledValue = 1;
  // one less than length since first match is 1 point already
  for (let i = 0; i < matches.length - 1; i += 1) {
    doubledValue *= 2;
  }

  return values.push(doubledValue);
});

const total = values.reduce((agg, value) => agg + value, 0);
console.log({ total });
