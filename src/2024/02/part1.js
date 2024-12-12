import fs from 'node:fs';
import path from 'node:path';

// const inputFile = path.join(path.resolve(), 'puzzle-input/example.txt');
const inputFile = path.join(path.resolve(), 'puzzle-input/mine.txt');

const input = fs.readFileSync(inputFile, 'utf-8');
const reports = input.split('\n');

const safeReports = reports.filter((report) => {
  const levels = report.split(' ');

  if (report.length === 0) return false;

  let isDecreasing;

  for (let i = 0; i < levels.length; i += 1) {
    if (i === 0) continue;

    if (levels[i - 1] === levels[i] || Math.abs(levels[i - 1] - levels[i]) > 3) {
      return false;
    }

    if (isDecreasing === undefined) {
      isDecreasing = levels[i - 1] - levels[i] < 0;
    }

    if ((isDecreasing && levels[i - 1] - levels[i] > 0) || (!isDecreasing && levels[i - 1] - levels[i] < 0)) {
      return false;
    }
  }

  return true;
});

console.log({ safeReports });
console.log(`Number of Safe Reports: ${safeReports.length}`);
