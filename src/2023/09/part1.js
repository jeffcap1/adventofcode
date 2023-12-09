import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const readings = input.split('\n').filter(Boolean);

const newExtrapolatedValues = [];

readings.forEach((reading) => {
  const values = reading.split(' ').map(Number);
  const sequence = [values];
  let rowTotal;

  // generates sequence
  do {
    rowTotal = 0;
    sequence.unshift([]); // push next line to the top
    const prevSequenceRow = sequence[1];

    for (let i = 1; i < prevSequenceRow.length; i += 1) {
      const curr = prevSequenceRow[i];
      const prev = prevSequenceRow[i - 1];
      const diff = curr - prev;
      sequence[0][i - 1] = diff;
      rowTotal += Math.abs(diff);
    }
  } while (rowTotal > 0);

  // remove zero row from sequence
  sequence.shift();

  // extrapolate next value
  const newValue = sequence.reduce((acc, curr) => acc + curr[curr.length - 1], 0);
  newExtrapolatedValues.push(newValue);
});

const total = newExtrapolatedValues.reduce((acc, curr) => acc + curr, 0);
console.log({ total });
