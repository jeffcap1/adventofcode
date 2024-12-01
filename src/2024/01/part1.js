import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');
const input = fs.readFileSync(inputFile, 'utf-8');

const nums1 = [];
const nums2 = [];

let total = 0;

input.split('\n').forEach((row) => {
  const parts = row.split(/ +/);
  if (parts.length < 2) {
    return;
  }
  nums1.push(Number(parts[0]));
  nums2.push(Number(parts[1]));
});

nums1.sort();
nums2.sort();

for (let i = 0; i < nums1.length; i += 1) {
  total += Math.abs(nums1[i] - nums2[i]);
}

console.log(`total is: ${total}`);
