import { getInput } from '../util/file-reader.js';
const input = await getInput('./day-14/input.txt');

const template = input[0].split('');
const insertionRules = getInsertionRules(input);

// part 1
let currentString = template;
for (let i = 1; i <= 10; i++) {
  currentString = nextStepNaive(currentString, insertionRules);
}
// console.log(_.countBy(currentString));

// part 2
let pairCounts = generateInitialPairCounts(template);
const throwawayCounts = generateInitialThrowawayCounts(template);

for (let i = 1; i <= 40; i++) {
  pairCounts = generateNextStep(pairCounts, throwawayCounts);
}
console.log(pairCounts);
console.log(throwawayCounts);
const totalCounts = getLetterCounts(pairCounts, throwawayCounts);

console.log(totalCounts);
console.log(_.max(Object.values(totalCounts)) - _.min(Object.values(totalCounts)));



function getInsertionRules(input) {
  const rules = {};
  input.forEach(line => {
    const parts = line.split('->');
    if (parts.length === 2) {
      rules[parts[0].trim()] = parts[1].trim();
    }
  });
  return rules;
}

function nextStepNaive(currentString, rules) {
  const updatedString = [];
  // make space for insertions
  for (let i = 0; i < currentString.length; i++) {
    updatedString[i * 2] = currentString[i];
  }
  // insertions
  for (let i = 0; i < updatedString.length - 2; i += 2) {
    const pairValue = updatedString[i] + updatedString[i + 2];
    updatedString[i + 1] = rules[pairValue];
  }
  return updatedString;
}

function generateInitialPairCounts(currentString) {
  const mapping = {};
  for (let i = 0; i < currentString.length - 1; i++) {
    const rule = currentString[i] + currentString[i + 1];
    if (!mapping[rule]) {
      mapping[rule] = 0;
    }
    mapping[rule]++;
  }
  return mapping;
}

function generateInitialThrowawayCounts(currentString) {
  const mapping = {};
  for (let i = 1; i < currentString.length - 1; i++) {
    const letter = currentString[i];
    if (!mapping[letter]) {
      mapping[letter] = 0;
    }
    mapping[letter]++;
  }
  return mapping;
}

function generateNextStep(pairCounts, throwawayCounts) {
  const updatedCounts = {};
  Object.keys(pairCounts).forEach(pair => {
    // determine the resulting pairs for the given pair
    const insertionLetter = insertionRules[pair];
    const parts = pair.split('');
    const pair1 = parts[0] + insertionLetter;
    const pair2 = insertionLetter + parts[1];
    // add resulting pairs to the updated counts
    if (!updatedCounts[pair1]) updatedCounts[pair1] = 0;
    if (!updatedCounts[pair2]) updatedCounts[pair2] = 0;
    const pairCount = pairCounts[pair];
    updatedCounts[pair1] += pairCount;
    updatedCounts[pair2] += pairCount;
    // update throwawayCounts
    if (!throwawayCounts[insertionLetter]) throwawayCounts[insertionLetter] = 0;
    throwawayCounts[insertionLetter] += pairCount;
  });
  return updatedCounts;
}

function getLetterCounts(pairCounts, throwawayCounts) {
  const counts = {};
  Object.keys(pairCounts).forEach(pair => {
    const part1 = pair.split('')[0];
    const part2 = pair.split('')[1];
    if (!counts[part1]) counts[part1] = 0;
    if (!counts[part2]) counts[part2] = 0;
    counts[part1] += pairCounts[pair];
    counts[part2] += pairCounts[pair];
  });

  Object.keys(counts).forEach(letter => {
    counts[letter] -= throwawayCounts[letter];
  });

  return counts;
}






