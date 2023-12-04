import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const lines = input.split('\n');

const nameToNumbersMap = {
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
};

const alphaNumSeries = 97;
const nameToNumberKeys = Object.keys(nameToNumbersMap);

// allows matching on overlapping values
const regex = new RegExp(`(?=(${nameToNumberKeys.join('|')}))`, 'g');


// attempted incorrect answers
// 48,737 (to low)
// 54,623 (to high)
// 54,573 (to low)
// 54,580 (to low)
// 54,591 (correct)

const total = lines.reduce((agg, line) => {
  if (line.length === 0) {
    return agg;
  }

  if (line[0].charCodeAt(0) < alphaNumSeries && line[line.length - 1].charCodeAt(0) < alphaNumSeries) {
    return parseInt(line[0] + line[line.length - 1], 10) + agg;
  }

  // convert number names to numbers
  let str = line;
  const matches = Array.from(line.matchAll(regex), x => x[1]);

  // replace only first and last match
  str = str.replace(matches[0], nameToNumbersMap[matches[0]]);
  str = str.replace(matches[matches.length - 1], nameToNumbersMap[matches[matches.length - 1]]);

  // remove all non-numeric characters
  const numbers = str.replace(/\D/gi, '');

  // console.log({ l: line, n: numbers, a: `${numbers[0]}${numbers[numbers.length - 1]}` });
  return parseInt(numbers[0] + numbers[numbers.length - 1], 10) + agg;
}, 0);


console.log({ total });

