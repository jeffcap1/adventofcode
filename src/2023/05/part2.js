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
// const file = new URL('input.txt', import.meta.url);
const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const sections = input
  .split('\n\n')
  .filter(Boolean)
  .map((section) => {
    const [title, sectionData] = section.split(/:\s+/);
    const data = sectionData.split('\n').filter(Boolean);
    return { title, data };
  });

const seedsRangeMaps = sections
  .shift()
  .data[0].match(/\d+ \d+/g)
  .map((seedAndRangeMap) => {
    const [seedStr, rangeStr] = seedAndRangeMap.split(' ');
    const seedRange = parseInt(rangeStr, 10);
    const seedStart = parseInt(seedStr, 10);
    const seedEnd = seedStart + seedRange - 1;
    return [seedStart, seedEnd, seedRange];
  })
  .sort((a, b) => (a[0] < b[0] ? -1 : 1));

const organizedSections = sections.map(({ title, data }) => ({
  title,
  data: data
    .map((row) => {
      const [destinationStartStr, sourceStartStr, rangeStr] = row.split(' ');
      const range = parseInt(rangeStr, 10);
      const destinationStart = parseInt(destinationStartStr, 10);
      const sourceStart = parseInt(sourceStartStr, 10);
      const sourceEnd = sourceStart + range - 1;
      return [sourceStart, sourceEnd, destinationStart, range];
    })
    .sort((a, b) => (a[0] < b[0] ? -1 : 1)),
}));

let lowestLocation = null;

seedsRangeMaps.forEach((seedRangeMap) => {
  const [seedStart, seedEnd] = seedRangeMap;

  for (let seed = seedStart; seed <= seedEnd; seed += 1) {
    let source = seed;
    // const keepVals = [seed];

    for (let x = 0; x < organizedSections.length; x += 1) {
      const section = organizedSections[x];
      // console.log({ source });
      // console.log(`== ${section.title} ==`);

      /*
      console.log({
        source,
        firstSourceStart: section.data[0][0],
        formula: `${source} < ${section.data[0][0]}`,
        answer: source < section.data[0][0],
      });
      console.log({
        source,
        lastSourceEnd: section.data[section.data.length - 1][1],
        formula: `${source} > ${section.data[section.data.length - 1][1]}`,
        answer: source > section.data[section.data.length - 1][1],
      });
      */

      // check if we are not in any of the ranges
      if (source < section.data[0][0] || source > section.data[section.data.length - 1][1]) {
        // console.log('we will not be in the ranges, so we are the same');
        // eslint-disable-next-line no-continue
        continue;
      }

      for (let row = 0; row < section.data.length; row += 1) {
        const [sourceStart, sourceEnd, destination] = section.data[row];
        // console.log({ sourceStart, sourceEnd, destination });

        // console.log({ source, sourceStart, sourceEnd, inRange: source >= sourceStart && source <= sourceEnd });
        if (source >= sourceStart && source <= sourceEnd) {
          // console.log({
          //   newSource: destination + (source - sourceStart),
          //   formula: `${source} - ${sourceStart}`,
          //   modifier: source - sourceStart,
          // });
          source = destination + (source - sourceStart);
          // keepVals.push(source);
          break;
        }

        // if (row === section.data.length - 1) {
        // console.log('not in map, so it is the same number');
        // keepVals.push(source);
        // }
      }
      // console.log('\n');
    }

    // console.log({ keepVals });

    if (lowestLocation === null || lowestLocation > source) {
      lowestLocation = source;
      console.log({ newLowestLocation: lowestLocation });
    }
  }
});

console.log('----\n');
console.log({ lowestLocation });
