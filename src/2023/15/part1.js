import fs from 'fs';

function updateValue(currentValue, letter) {
  let newValue = currentValue;

  newValue += letter.charCodeAt(0);
  newValue *= 17;
  newValue %= 256;

  return newValue;
}

const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const sequences = input.split('\n')[0].split(',');

console.log({ sequences });

const results = [];

sequences.forEach((sequence) => {
  const letters = sequence.split('');
  let value = 0;

  letters.forEach((letter) => {
    value = updateValue(value, letter);
  });

  results.push(value);
});

const total = results.reduce((acc, cur) => acc + cur, 0);
console.log({ total });
