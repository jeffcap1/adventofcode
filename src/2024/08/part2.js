import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const rows = input.split('\n').filter(Boolean);

const mapHeight = rows.length - 1;
const mapWidth = rows[0].length - 1;

const antinodes = [];
const antinodesUnique = new Set();
const antennas = [];

function isValidSpace(x, y) {
  if (x >= 0 && x <= mapWidth && y >= 0 && y <= mapHeight) {
    return true;
  }
  return false;
}

for (let y = 0; y < rows.length; y += 1) {
  const row = rows[y];
  for (let x = 0; x < row.length; x += 1) {
    if (row[x] !== '.') {
      antennas.push([x, y]);
    }
  }
}

for (let i = 0; i < antennas.length; i += 1) {
  const antenna = antennas[i];
  const frequency = rows[antennas[i][1]][antennas[i][0]];

  if (!antennas[i + 1]) {
    break;
  }

  for (let a = i + 1; a < antennas.length; a += 1) {
    const nextAntenna = antennas[a];
    const nextFrequency = rows[antennas[a][1]][antennas[a][0]];

    if (frequency !== nextFrequency) {
      continue;
    }

    const xDistance = antenna[0] - nextAntenna[0];
    const yDistance = antenna[1] - nextAntenna[1];

    let antinode1 = antenna;
    let antinode2 = nextAntenna;

    if (!antinodes.includes(`${antinode1[1] + 1}, ${antinode1[0] + 1}`)) {
      antinodesUnique.add(`${antinode1[1] + 1}, ${antinode1[0] + 1}`);
    }

    if (!antinodes.includes(`${antinode2[1] + 1}, ${antinode2[0] + 1}`)) {
      antinodesUnique.add(`${antinode2[1] + 1}, ${antinode2[0] + 1}`);
    }

    while (isValidSpace(antinode1[0], antinode1[1]) || isValidSpace(antinode2[0], antinode2[1])) {
      antinode1 = [antinode1[0] + xDistance, antinode1[1] + yDistance];
      antinode2 = [antinode2[0] + xDistance * -1, antinode2[1] + yDistance * -1];

      if (isValidSpace(antinode1[0], antinode1[1]) && rows[antinode1[1]][antinode1[0]] === '.') {
        antinodesUnique.add(`${antinode1[1] + 1}, ${antinode1[0] + 1}`);
      }

      if (isValidSpace(antinode2[0], antinode2[1]) && rows[antinode2[1]][antinode2[0]] === '.') {
        antinodesUnique.add(`${antinode2[1] + 1}, ${antinode2[0] + 1}`);
      }
    }
  }
}

console.log(antinodesUnique.size);
