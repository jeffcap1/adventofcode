import fs from 'fs';

function updateValue(currentValue, letter) {
  let newValue = currentValue;

  newValue += letter.charCodeAt(0);
  newValue *= 17;
  newValue %= 256;

  return newValue;
}

function getBoxFocusPower(index, box) {
  const number = index + 1;
  let total = 0;

  if (box.size === 0) {
    return total;
  }

  let idx = 1;
  box.forEach((value) => {
    total += number * idx * value;
    idx += 1;
  });

  return total;
}

const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const sequences = input.split('\n')[0].split(',');

const boxes = [...Array(256)].map(() => new Map());
const lineRegex = /^(.+)(=|-)(\d+)?$/;

sequences.forEach((sequence) => {
  const [_, label, symbol, number] = lineRegex.exec(sequence);
  const letters = label.split('');
  let value = 0;

  letters.forEach((letter) => {
    value = updateValue(value, letter);
  });

  if (symbol === '-' && boxes[value].has(label)) {
    boxes[value].delete(label);
  } else if (symbol === '=') {
    boxes[value].set(label, parseInt(number, 10));
  }
});

let total = 0;
boxes.forEach((box, index) => {
  total += getBoxFocusPower(index, box);
});

console.log({ total });
