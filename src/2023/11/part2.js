import fs from 'fs';

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const rows = input
  .split('\n')
  .filter(Boolean)
  .map((row) => row.split(''));

const galaxies = [];
const paths = [];

// minus one to account for the space already there
const expansion = 1000000 - 1;
// const expansion = 1;

const expandHorizontal = [];
const expandVertical = [];

// mark horizontally expanding rows
rows.forEach((row, y) => {
  if (!row.includes('#')) {
    expandHorizontal.push(y);
  }
});

// mark vertically expanding rows
rows[0].forEach((char, x) => {
  let rowHasGalaxy = false;
  for (let y = 0; y < rows.length; y += 1) {
    if (rows[y][x] === '#') {
      rowHasGalaxy = true;
    }
  }

  if (!rowHasGalaxy) {
    expandVertical.push(x);
  }
});

rows.forEach((row, y) => {
  row.forEach((char, x) => {
    if (char === '#') {
      galaxies.push([x, y]);
    }
  });
});

while (galaxies.length > 1) {
  const [x1, y1] = galaxies.shift();
  for (let i = 0; i < galaxies.length; i += 1) {
    const [x2, y2] = galaxies[i];
    let path = Math.abs(x1 - x2) + Math.abs(y1 - y2);

    for (let j = 0; j < expandVertical.length; j += 1) {
      if (expandVertical[j] > Math.min(x1, x2) && expandVertical[j] < Math.max(x2, x1)) {
        path += expansion;
      }
    }

    for (let j = 0; j < expandHorizontal.length; j += 1) {
      if (expandHorizontal[j] > Math.min(y1, y2) && expandHorizontal[j] < Math.max(y2, y1)) {
        path += expansion;
      }
    }

    paths.push(path);
  }
}

const total = paths.reduce((acc, path) => acc + path, 0);
console.log({ total });
