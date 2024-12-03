import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const data = input.split('\n');
data.splice(-1, 1);

const matches = [];
const regex = /^\d+,\d+(?=\))/g;
const rows = data.join('').split(/(do|don't)\(/g);
const keep = rows.splice(0, 1);

for (let i = 1; i < rows.length; i += 2) {
  if (rows[i - 1] === "don't") {
    continue;
  }
  keep.push(rows[i]);
}

keep.forEach((row) => {
  row.split('mul(').forEach((res) => {
    if (regex.test(res)) {
      matches.push(res.match(regex)[0]);
    }
  });
});

let total = 0;
matches.forEach((match) => {
  const nums = match.replace(/[mul()]/gi, '').split(',');
  total += nums[0] * nums[1];
});

console.log({ total });
