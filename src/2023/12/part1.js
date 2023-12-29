import fs from 'fs';

function creationVariationFactory(springs) {
  return function createVariation(variations, variation = '', position = 0) {
    let newVariation = variation;
    let charPosition = position;
    let char = springs[position];

    // end of the springs list
    while (char !== undefined && char !== '?') {
      newVariation += char;
      charPosition += 1;
      char = springs[charPosition];
    }

    if (char === undefined) {
      variations.add(newVariation);
      return variations;
    }

    createVariation(variations, `${newVariation}.`, charPosition + 1);
    createVariation(variations, `${newVariation}#`, charPosition + 1);
    return variations;
  };
}

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const rows = input
  .split('\n')
  .filter(Boolean)
  .map((row) => row.split(' '));

const validVariations = [];

rows.forEach((row) => {
  // const row = rows[3];
  const [springs, groups] = row;

  // expect an array/Set back
  const createVariation = creationVariationFactory(springs);
  const [...variations] = createVariation(new Set());

  for (let i = 0; i < variations.length; i += 1) {
    let isValid = true;
    const variation = variations[i];
    const groupings = variation.match(/(#)+/gm);
    const springGroups = groups.split(',').map(Number);

    // eslint-disable-next-line no-continue
    if (groupings?.length !== springGroups.length) continue;

    for (let x = 0; x < springGroups.length; x += 1) {
      const group = springGroups[x];
      const grouping = groupings[x];
      if (grouping.length !== group) {
        isValid = false;
        // eslint-disable-next-line no-continue
        continue;
      }

      if (x === springGroups.length - 1 && isValid) {
        validVariations.push(variation);
      }
    }
  }
});

console.log({ total: validVariations.length });
