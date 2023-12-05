import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const lines = input.split('\n');

const gamePowers = [];
lines.forEach((line) => {
  if (line.length === 0) return;

  const parts = line.split(':');
  const gameSets = parts[1].split(';');
  const gameValues = { red: 0, green: 0, blue: 0 };

  gameSets.forEach((set) => {
    const values = set.split(',');
    values.forEach((value) => {
      const valueParts = value.trim().split(' ');
      const color = valueParts[1];
      const number = parseInt(valueParts[0], 10);

      // update to new largest amount
      if (gameValues[color] < number) {
        gameValues[color] = number;
      }
    });
  });

  // power => multiple each cube value together
  gamePowers.push(gameValues.red * gameValues.green * gameValues.blue);
});

const total = gamePowers.reduce((agg, game) => agg + game, 0);
console.log({ total });
