import { getInput } from '../util/file-reader.js';

const beginChunkChars = ['(', '[', '{', '<'];
const endChunkChars = [')', ']', '}', '>'];
function isValidPair(begin, end) {
  return (begin === '(' && end === ')')
      || (begin === '[' && end === ']')
      || (begin === '{' && end === '}')
      || (begin === '<' && end === '>');
}
const input = await getInput('./day-10/input.txt');

// part 1
const invalidChars = [];
input.forEach(line => {
  const invalidChar = validateLine(line);
  if (invalidChar) invalidChars.push(invalidChar);
})
console.log(getSyntaxErrorScore(invalidChars));

// part 2
const incompleteStacks = [];
input.forEach(line => {
  const stack = getIncompleteLineStack(line);
  if (stack.length) incompleteStacks.push(stack);
});
const completionArrays = [];
incompleteStacks.forEach(stack => {
  completionArrays.push(getCompletionArray(stack));
});
const scores = [];
completionArrays.forEach(completionArray => {
  scores.push(getCompletionArrayScore(completionArray));
});
scores.sort((a,b) => a - b);
console.log(scores[Math.floor(scores.length / 2)]);

// returns invalid chunk if found
function validateLine(line) {
  const stack = [];
  for (let i = 0; i < line.length; i++) {
    const currentChar = line[i];

    if (beginChunkChars.includes(currentChar)) {
      stack.push(currentChar);
    } else {
      const pairedChar = stack.pop();
      if (!isValidPair(pairedChar, currentChar)) return currentChar;
    }
  }
}

function getSyntaxErrorScore(invalidChars) {
  let score = 0;
  invalidChars.forEach(char => {
    if (char === ')') score += 3;
    if (char === ']') score += 57;
    if (char === '}') score += 1197;
    if (char === '>') score += 25137;
  })
  return score;
}

function getIncompleteLineStack(line) {
  const stack = [];
  for (let i = 0; i < line.length; i++) {
    const currentChar = line[i];

    if (beginChunkChars.includes(currentChar)) {
      stack.push(currentChar);
    } else {
      const pairedChar = stack.pop();
      if (!isValidPair(pairedChar, currentChar)) return [];
    }
  }
  return stack;
}

function getCompletionArray(stack) {
  const completionArray = [];
  while (stack.length > 0) {
    completionArray.push(getEndCharacter(stack.pop()));
  }
  return completionArray;
}

function getEndCharacter(character) {
  if (character === '(') return ')';
  if (character === '[') return ']';
  if (character === '{') return '}';
  if (character === '<') return '>';
}

function getCompletionArrayScore(completionArray) {
  let score = 0;

  completionArray.forEach(character => {
    score = score * 5;
    if (character === ')') score += 1;
    if (character === ']') score += 2;
    if (character === '}') score += 3;
    if (character === '>') score += 4;
  });

  return score;
}






