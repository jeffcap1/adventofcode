/**
 * correct answer 54,591
 */

import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const lines = input.split('\n');

const nameToNumbersMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

const values = [];
const alphaNumSeries = 97;
const nameToNumberKeys = Object.keys(nameToNumbersMap);
const regex = new RegExp(nameToNumberKeys.join('|'));

function findNumber(line, idx, substr, outofbounds) {
  if (line[idx].charCodeAt(0) < alphaNumSeries) {
    return line[idx];
  }

  const match = substr.match(regex);
  if (match) {
    return nameToNumbersMap[match[0]];
  }

  if (idx === outofbounds) {
    console.log('no starting match found???');
    return '';
  }

  return null;
}

function findStartNumber(line, idx) {
  const substr = line.substring(0, idx + 1);
  const number = findNumber(line, idx, substr, line.length - 1);
  return number || findStartNumber(line, idx + 1);
}

function findEndNumber(line, idx) {
  const substr = line.substring(idx, line.length);
  const number = findNumber(line, idx, substr, 0);
  return number || findEndNumber(line, idx - 1);
}

lines.forEach((line) => {
  if (line.length === 0) return;

  const sIdx = 0;
  const eIdx = line.length - 1;
  const startNumber = findStartNumber(line, sIdx);
  const endNumber = findEndNumber(line, eIdx);
  values.push(parseInt(startNumber + endNumber, 10));
});

const total = values.reduce((agg, val) => agg + val, 0);
console.log({ total });
