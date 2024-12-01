import fs from 'fs';

// read input file
// const file = new URL('small_input.txt', import.meta.url);
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const inputRows = input.split('\n').filter(Boolean);

const rows = [];
const expandedRows = [];
const galaxies = [];
const paths = [];

// expand universe horizontally
inputRows.forEach((row) => {
  if (!row.includes('#')) {
    rows.push(row.split(''));
  }
  rows.push(row.split(''));
});

// expand universe vertically
let xShift = 0;
rows[0].forEach((char, x) => {
  let rowHasGalaxy = false;
  for (let y = 0; y < rows.length; y += 1) {
    if (rows[y][x] === '#') {
      rowHasGalaxy = true;
    }

    expandedRows[y] = expandedRows[y] || [];
    expandedRows[y].push(rows[y][x]);
  }

  if (!rowHasGalaxy) {
    for (let y = 0; y < rows.length; y += 1) {
      expandedRows[y].splice(x + xShift, 0, '.');
      xShift += 1;
    }
  }
});

// test output
// fs.writeFileSync('output.txt', expandedRows.map((row) => row.join('')).join('\n'));

expandedRows.forEach((row, y) => {
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
    const path = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    paths.push(path);
  }
}

const total = paths.reduce((acc, path) => acc + path, 0);
console.log({ total });

// 9960306 -- too high
// 9947476
