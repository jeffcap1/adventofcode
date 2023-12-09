/**
 *** Problem Notes ***
 * first line, seeds to be planted
 *
 *** Value Mapping Explanation ***
 * destination range start (ex. soil)
 * source range start (ex. seed)
 * range length
 * any unmapped source numbers correspond to the same destination number
 */

import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const sections = input.split('\n\n');

function findDestinationFromSourceRange(source, sourceRangeStart, destinationRangeStart, rangeLength) {
  const sourceNum = parseInt(source, 10);
  const sourceRangeStartNum = parseInt(sourceRangeStart, 10);
  const destinationRangeStartNum = parseInt(destinationRangeStart, 10);
  const rangeLengthNum = parseInt(rangeLength, 10);

  if (sourceNum < sourceRangeStartNum || sourceNum >= sourceRangeStartNum + rangeLengthNum) {
    return false;
  }

  return destinationRangeStartNum + (sourceNum - sourceRangeStartNum);
}

let lowestLocation = null;

const seeds = sections.shift().split(': ')[1].split(' ');

seeds.forEach((seed) => {
  const lineValueMap = [];
  const seedNumber = parseInt(seed, 10);
  lineValueMap.push(seedNumber);

  sections.forEach((section, idx) => {
    const sectionRows = section.split('\n');
    sectionRows.shift(); // remove title line

    let rowId = 0;
    while (rowId < sectionRows.length && lineValueMap.length < idx + 2) {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = sectionRows[rowId].split(' ');
      const destination = findDestinationFromSourceRange(
        lineValueMap[lineValueMap.length - 1],
        sourceRangeStart,
        destinationRangeStart,
        rangeLength
      );

      if (destination) {
        lineValueMap.push(destination);
        break;
      }

      rowId += 1;
    }

    // source was not in map so destination is the same number
    if (lineValueMap.length < idx + 2) {
      lineValueMap.push(lineValueMap[lineValueMap.length - 1]);
    }
  });

  console.log({ lineValueMap });

  if (lowestLocation === null || lowestLocation > lineValueMap[lineValueMap.length - 1]) {
    lowestLocation = lineValueMap[lineValueMap.length - 1];
  }
});

console.log({ lowestLocation });
