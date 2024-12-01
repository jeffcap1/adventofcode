import fs from 'fs';

// read input file
const file = new URL('input.txt', import.meta.url);
// const file = new URL('small_input.txt', import.meta.url);
const input = fs.readFileSync(file, 'utf-8');
const [gameTime, recordDistance] = input
  .replace(/^\w+: +/gm, '')
  .replace(/ +/g, '')
  .split('\n')
  .map((line) => parseInt(line, 10));

let startWinning;

for (let buttonHeld = 1; buttonHeld < gameTime; buttonHeld += 1) {
  const remainingTime = gameTime - buttonHeld;
  const distance = buttonHeld * remainingTime;

  if (distance > recordDistance) {
    startWinning = buttonHeld;
    break;
  }
}

console.log({
  lostAtBeginning: startWinning,
  totalBadGames: startWinning * 2,
  gameTime,
  wins: gameTime - (startWinning * 2 - 1),
});
