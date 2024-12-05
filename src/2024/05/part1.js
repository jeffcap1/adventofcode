import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const [rulesPair, pages] = input.split('\n\n').map((line) => line.split('\n').filter(Boolean));

let total = 0;
const middleNumbers = [];
const rules = new Map();

// eslint-disable-next-line no-restricted-syntax
for (const rule of rulesPair) {
  const parts = rule.split('|');

  if (!rules.has(parts[0])) {
    rules.set(parts[0], [parts[1]]);
    continue;
  }

  const ruleOrder = rules.get(parts[0]);
  ruleOrder.push(parts[1]);
  rules.set(parts[0], ruleOrder);
}

// eslint-disable-next-line no-restricted-syntax
for (const page of pages) {
  const pageItems = page.split(',');
  const errors = [];

  let curr = 1;

  while (curr !== pageItems.length) {
    const numRules = rules.get(pageItems[curr]) || [];
    const prevNums = pageItems.slice(0, curr);

    // check valid
    for (let i = 0; i < numRules.length; i += 1) {
      if (prevNums.includes(numRules[i])) {
        errors.push(`${pageItems[curr]} should come before ${numRules[i]}`);
        break;
      }
    }

    if (errors.length > 0) {
      break;
    }

    curr += 1;
  }

  if (errors.length > 0) {
    console.log({ errors, page });
    continue;
  }

  const middleIndex = Math.floor(pageItems.length / 2);
  middleNumbers.push(pageItems[middleIndex]);
  total += Number(pageItems[middleIndex]);
}

console.log({ middleNumbers });
console.log({ total });
