import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-2/input.txt');

let xPos = 0;
let depth = 0;

for (const instruction of input) {
  const parts = instruction.split(' ');

  const action = parts[0];
  const amount = Number(parts[1]);

  if (action === 'forward') {
    xPos += amount;
  } else if (action === 'down') {
    depth += amount;
  } else if (action === 'up') {
    depth -= amount;
  }
}

console.log(xPos, depth);
console.log(xPos * depth);

let aim = 0;
xPos = 0;
depth = 0;

for (const instruction of input) {
  const parts = instruction.split(' ');

  const action = parts[0];
  const amount = Number(parts[1]);

  if (action === 'forward') {
    xPos += amount;
    depth = depth + (amount * aim);
  } else if (action === 'down') {
    aim += amount;
  } else if (action === 'up') {
    aim -= amount;
  }
}

console.log(xPos, depth);
console.log(xPos * depth);
