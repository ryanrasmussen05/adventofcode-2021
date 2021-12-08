import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-8/input.txt');

// part 1
let total = 0;
input.forEach(line => {
  const parts = line.split('|');
  const output = parts[1].trim();
  const outputParts = output.split(' ');
  outputParts.forEach(part => {
    if (part.length === 2 || part.length === 3 || part.length === 4 || part.length === 7) total++
  });
});
console.log(total);


// part 2
let patternValueRealValueMap, patterns, fourPattern, sevenPattern;
let sum = 0;
input.forEach(line => {
  sum += getCorrectOutput(line);
});
console.log(sum);

function getCorrectOutput(line) {
// look for segments of length 2 & 3, the segment odd segment out maps to the real A
  const parts = line.split('|');
  patterns = parts[0].trim().split(' ');
  let output = parts[1].trim().split(' ').map(foo => foo.split('').sort());

  patternValueRealValueMap = buildPatternValueMap();
  const onePattern = patterns.find(pattern => pattern.length === 2).split('').sort();
  patterns = patterns.filter(pattern => pattern.length !== 2);
  fourPattern = patterns.find(pattern => pattern.length === 4).split('').sort();
  patterns = patterns.filter(pattern => pattern.length !== 4);
  sevenPattern = patterns.find(pattern => pattern.length === 3).split('').sort();
  patterns = patterns.filter(pattern => pattern.length !== 3);
  const eightPattern = patterns.find(pattern => pattern.length === 7).split('').sort();
  patterns = patterns.filter(pattern => pattern.length !== 7);
  const ninePattern = findNinePattern().split('').sort();

// a is the difference between 1 and 7 pattern
  const patterValueForA = findArrayDifference(sevenPattern, onePattern)[0];
  setStrictDeduction(patternValueRealValueMap, { patternValues: [patterValueForA], realValues: ['a'] });

// intersection of 1 and 7 patterns can be either c or f
  const patternValuesForCF = findArrayIntersection(sevenPattern, onePattern);
  setStrictDeduction(patternValueRealValueMap, { patternValues: patternValuesForCF, realValues: ['c','f'] });

// diff between 1 and 4 patterns can be either b or d
  const patternValuesForBD = findArrayDifference(fourPattern, onePattern);
  setStrictDeduction(patternValueRealValueMap, { patternValues: patternValuesForBD, realValues: ['b', 'd'] });

// diff between union(4,7) and 9 is g
  const unionFourSeven = findArrayUnion(fourPattern, sevenPattern);
  const patternValuesForG = findArrayDifference(unionFourSeven, ninePattern);
  setStrictDeduction(patternValueRealValueMap, { patternValues: patternValuesForG, realValues: ['g'] });

// can deduct value of d based on patterns of 2,3,5
  setStrictDeduction(patternValueRealValueMap, { patternValues: [findDDeduction()], realValues: ['d'] });

// can deduct value of f based on patterns of 0,6
  setStrictDeduction(patternValueRealValueMap, { patternValues: findFDeduction(), realValues: ['f'] });

// for each output part, determine the matching pattern
  const correctedOutput = output.map(part => getCharacterForOutput(part));
  return Number(correctedOutput.join(''));
}

function findArrayDifference(array1, array2) {
  if (array1.length >= array2.length) {
    return array1.filter(x => !array2.includes(x));
  }
  return array2.filter(x => !array1.includes(x));
}

function findArrayUnion(array1, array2) {
  return [...new Set([...array1, ...array2])];
}

function findArrayIntersection(array1, array2) {
  return array1.filter(x => array2.includes(x));
}

// map pattern value to real value
function buildPatternValueMap() {
  return {
    a: ['a','b','c','d','e','f','g'],
    b: ['a','b','c','d','e','f','g'],
    c: ['a','b','c','d','e','f','g'],
    d: ['a','b','c','d','e','f','g'],
    e: ['a','b','c','d','e','f','g'],
    f: ['a','b','c','d','e','f','g'],
    g: ['a','b','c','d','e','f','g'],
  }
}

// deduction has array of pattern values to array of real values
function setStrictDeduction(patternValueMap, deduction) {
  Object.keys(patternValueMap).forEach(patternValue => {
    if (deduction.patternValues.includes(patternValue)) {
      patternValueMap[patternValue] = deduction.realValues;
    } else {
      patternValueMap[patternValue] = patternValueMap[patternValue].filter(value => !deduction.realValues.includes(value));
    }
  });
}

// nine can be found by finding pattern of length 6 that contain the union of patterns for 4 and 7
function findNinePattern() {
  const union = findArrayUnion(fourPattern, sevenPattern);
  const ninePattern = patterns.find(pattern => {
    if (pattern.length !== 6) return false;
    const patternParts = pattern.split('');
    return union.every(segment => patternParts.includes(segment));
  })
  patterns = patterns.filter(pattern => pattern !== ninePattern);
  return ninePattern;
}

// of the 5 length pattern, a,d,g are in all of them, but we already know what a and g are
function findDDeduction() {
  let lengthFivePatterns = patterns.filter(pattern => pattern.length === 5);
  lengthFivePatterns = lengthFivePatterns.map(pattern => pattern.split('').sort());

  let segmentForD;
  ['a','b','c','d','e','f','g'].forEach(segment => {
    if (lengthFivePatterns.every(pattern => pattern.includes(segment))) {
      if (patternValueRealValueMap[segment].length !== 1) {
        segmentForD = segment;
      }
    }
  });
  return segmentForD;
}

// of the 6 length patterns, remove the segments that have mappings, the intersection of the remainders is f
function findFDeduction() {
  let lengthSixPatterns = patterns.filter(pattern => pattern.length === 6);
  lengthSixPatterns = lengthSixPatterns.map(pattern => pattern.split('').sort());

  const patternsWithKnownRemoved = [];
  lengthSixPatterns.forEach(pattern => {
    patternsWithKnownRemoved.push(pattern.filter(segment => patternValueRealValueMap[segment].length !== 1));
  });

  return findArrayIntersection(...patternsWithKnownRemoved);
}

function getCharacterForOutput(output) {
  let translated = output.map(character => patternValueRealValueMap[character][0]).sort().join('');

  switch(translated) {
    case 'abcefg': return '0';
    case 'cf': return '1';
    case 'acdeg': return '2';
    case 'acdfg': return '3';
    case 'bcdf': return '4';
    case 'abdfg': return '5';
    case 'abdefg': return '6';
    case 'acf': return '7';
    case 'abcdefg': return '8';
    case 'abcdfg': return '9';
  }
}

