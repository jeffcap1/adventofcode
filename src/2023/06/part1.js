import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const [gameTimesString, gameDistancesString] = input.replace(/^\w+: +/gm, '').split('\n');

const gameWinningPossibilities = [];
const gameTimes = gameTimesString.split(/\s+/);
const gameDistances = gameDistancesString.split(/\s+/);
const games = gameTimes.map((time, idx) => ({ time: parseInt(time, 10), distance: parseInt(gameDistances[idx], 10) }));

games.forEach((game) => {
  let wins = 0;

  for (let buttonHeld = 1; buttonHeld < game.time; buttonHeld += 1) {
    const remainingTime = game.time - buttonHeld;
    const distance = buttonHeld * remainingTime;

    if (distance > game.distance) {
      wins += 1;
    }
  }

  gameWinningPossibilities.push(wins);
});

const totalPossibilities = gameWinningPossibilities.reduce((acc, val) => acc * val, 1);
console.log({ totalPossibilities });
