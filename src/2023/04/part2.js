import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const lines = input.split('\n').filter(Boolean);

const values = Array(lines.length).fill(1);

const regex = / +/;

lines.forEach((line, idx) => {
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
    return false;
  }

  const numberOfCopies = values[idx];
  for (let i = 1; i <= matches.length; i += 1) {
    if (values[idx + 1]) {
      values[idx + i] = numberOfCopies + values[idx + i];
    }
  }

  return true;
});

const total = values.reduce((agg, value) => agg + value, 0);
console.log({ total });
