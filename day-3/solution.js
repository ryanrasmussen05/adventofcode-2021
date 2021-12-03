import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-3/input.txt');

let part1 = '';
for (let i = 0; i < input[0].length; i++) {
  part1 = part1.concat(getMostCommonAtIndex(input, i));
}
console.log(parseInt(part1, 2));
let part2 = '';
for (let i = 0; i < input[0].length; i++) {
  part2 = part2.concat(getMostCommonAtIndex(input, i, true));
}
console.log(parseInt(part2, 2));


let currInput = input;
let currIndex = 0;
while(currInput.length > 1) {
  const currentChar = getMostCommonAtIndex(currInput, currIndex);

  currInput = currInput.filter(line => {
    return line[currIndex] === currentChar
  });
  currIndex++;
}
console.log('oxygen', parseInt(currInput[0], 2));

currInput = input;
currIndex = 0;
while(currInput.length > 1) {
  const currentChar = getMostCommonAtIndex(currInput, currIndex, true);

  currInput = currInput.filter(line => {
    return line[currIndex] === currentChar
  });
  currIndex++;
}
console.log('co2', parseInt(currInput[0], 2));

function getMostCommonAtIndex(input, index, reverse = false) {
  let zeroCount = 0;
  let oneCount = 0;

  input.forEach(line => {
    const character = line[index];
    if (character === '0') {
      zeroCount++;
    } else {
      oneCount ++;
    }
  });

  if (zeroCount === 0) return '1';
  if (oneCount === 0) return '0';

  if (!reverse) {
    if (zeroCount > oneCount) return '0';
    if (oneCount >= zeroCount) return '1';
  }
  if (zeroCount > oneCount) return '1';
  if (oneCount >= zeroCount) return '0';
}
