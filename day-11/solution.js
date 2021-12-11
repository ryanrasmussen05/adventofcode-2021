import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-11/input.txt');
let octopi = [];
input.forEach(line => {
  octopi.push(line.split('').map(octopus => Number(octopus)));
});

// part 1
let totalFlashes = 0;
for (let i = 1; i <= 100; i++) {
  totalFlashes += simulateStep(octopi);
}
console.log(totalFlashes);

// part 2
octopi = [];
input.forEach(line => {
  octopi.push(line.split('').map(octopus => Number(octopus)));
});
let numSteps = 0;
while (true) {
  numSteps++;
  if (simulateStepWithAllCheck(octopi) === 100) {
    console.log(numSteps);
    break;
  }
}

function simulateStepWithAllCheck(octopi) {
  let numFlashes = 0;

  // increment all octopi
  for (let row = 0; row < octopi.length; row++) {
    for (let col = 0; col < octopi.length; col++) {
      octopi[row][col] += 1;
    }
  }

  let newFlashes = findNewFlashes(octopi);
  let totalFlashes = newFlashes.length;
  while(newFlashes.length > 0) {
    newFlashes.forEach(newFlash => {
      processFlash(octopi, newFlash);
      numFlashes++;
    });
    newFlashes = findNewFlashes(octopi);
    totalFlashes += newFlashes.length;
  }
  resetFlashedOctopi(octopi);
  return totalFlashes;
}

function simulateStep(octopi) {
  let numFlashes = 0;

  // increment all octopi
  for (let row = 0; row < octopi.length; row++) {
    for (let col = 0; col < octopi.length; col++) {
      octopi[row][col] += 1;
    }
  }

  let newFlashes = findNewFlashes(octopi);
  while(newFlashes.length > 0) {
    newFlashes.forEach(newFlash => {
      processFlash(octopi, newFlash);
      numFlashes++;
    });
    newFlashes = findNewFlashes(octopi);
  }
  resetFlashedOctopi(octopi);
  return numFlashes;
}

function findNewFlashes(octopi) {
  const flashCoords = [];

  for (let row = 0; row < octopi.length; row++) {
    for (let col = 0; col < octopi.length; col++) {
      const octopiVal = octopi[row][col];
      if (octopiVal >= 10 && octopiVal < 1000) {
        flashCoords.push([row, col]);
        octopi[row][col] = 1000;
      }
    }
  }
  return flashCoords;
}

function processFlash(octopi, flashCoords) {
  const row = flashCoords[0];
  const col = flashCoords[1];

  // top left
  if (row > 0 && col > 0) octopi[row - 1][col - 1] += 1;
  // top
  if (row > 0) octopi[row - 1][col] += 1;
  // top right
  if (row > 0 && col < octopi.length - 1) octopi[row - 1][col + 1] += 1;
  // left
  if (col > 0) octopi[row][col - 1] += 1;
  // right
  if (col < octopi.length - 1) octopi[row][col + 1] += 1;
  // bottom left
  if (row < octopi.length - 1 && col > 0) octopi[row + 1][col - 1] += 1;
  // bottom
  if (row < octopi.length - 1) octopi[row + 1][col] += 1;
  // bottom right
  if (row < octopi.length - 1 && col < octopi.length - 1) octopi[row + 1][col + 1] += 1;
}

function resetFlashedOctopi(octopi) {
  for (let row = 0; row < octopi.length; row++) {
    for (let col = 0; col < octopi.length; col++) {
      if (octopi[row][col] >= 1000) octopi[row][col] = 0;
    }
  }
}



