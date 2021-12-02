import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-1/input.txt');

let numIncreases = 0;

for (let i = 1; i < input.length; i++) {
  if (Number(input[i]) > Number(input[i-1])) numIncreases++;
}

console.log(numIncreases);

let numWindowIncreases = 0;

for (let i = 1; i < input.length - 2; i++) {
  const firstWindow = Number(input[i-1]) + Number(input[i]) + Number(input[i + 1]);
  const secondWindow = Number(input[i]) + Number(input[i + 1]) + Number(input[i + 2]);
  if (secondWindow > firstWindow) numWindowIncreases++;
}

console.log(numWindowIncreases);