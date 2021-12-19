import { getInput } from '../util/file-reader.js';
const input = await getInput('./day-18/input.txt');

let sampleInput = [
  '[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]',
    '[[[5,[2,8]],4],[5,[[9,9],0]]]',
    '[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]',
    '[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]',
    '[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]',
    '[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]',
    '[[[[5,4],[7,7]],8],[[8,3],8]]',
    '[[9,3],[[9,9],[6,[4,9]]]]',
    '[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]',
    '[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]',
];

const parsedInput = input.map(line => JSON.parse(line));

// part 1
let currentSnailfishGroup = parsedInput[0];
for (let i = 1; i < parsedInput.length; i++) {
  currentSnailfishGroup = addSnailfish(currentSnailfishGroup, parsedInput[i]);
  reduceSnailfish(currentSnailfishGroup);
}
console.log(JSON.stringify(currentSnailfishGroup));
console.log(getMagnitude(currentSnailfishGroup));

// part 2
let largestMagnitude = 0;
for (let i = 0; i < parsedInput.length; i++) {
  for (let j = 0; j < parsedInput.length; j++) {
    if (i === j) continue;
    let newGroup = addSnailfish(parsedInput[i], parsedInput[j]);
    reduceSnailfish(newGroup);
    const mag = getMagnitude(newGroup);
    if (mag > largestMagnitude) {
      largestMagnitude = mag;
      console.log(largestMagnitude);
      console.log(JSON.stringify(newGroup));
    }
  }
}



function addSnailfish(group1, group2) {
  return [_.cloneDeep(group1), _.cloneDeep(group2)];
}

function reduceSnailfish(snailfishGroup) {
  let shouldRecurse = false;

  let indexFourDeepList = indexOfFourDeepNesting(snailfishGroup);
  while (indexFourDeepList) {
    explodeFirstPair(snailfishGroup, indexFourDeepList);
    indexFourDeepList = indexOfFourDeepNesting(snailfishGroup);
  }

  let indexDoubleDigit = indexOfDoubleDigit(snailfishGroup);
  if (indexDoubleDigit) {
    splitFirstDoubleDigit(snailfishGroup, indexDoubleDigit);
    shouldRecurse = true;
  }

  if (shouldRecurse) reduceSnailfish(snailfishGroup);
}

function indexOfFourDeepNesting(snailFishGroup, indexList = []) {
  if (indexList.length === 4) return indexList;
  for (let i = 0; i < snailFishGroup.length; i++) {
    const subGroup = snailFishGroup[i];
    if (Array.isArray(subGroup)) {
      const updatedIndexList = indexOfFourDeepNesting(subGroup, [...indexList, i]);
      if (updatedIndexList && updatedIndexList.length === 4) return updatedIndexList;
    }
  }
  return indexList.length === 4 ? indexList : null;
}

function indexOfDoubleDigit(snailFishGroup, indexList = []) {
  for (let i = 0; i < snailFishGroup.length; i++) {
    const subGroup = snailFishGroup[i];
    const updatedIndexList = [...indexList, i];
    if (Array.isArray(subGroup)) {
      const finalIndexList = indexOfDoubleDigit(subGroup, updatedIndexList);
      if (finalIndexList) return finalIndexList;
    } else if (subGroup >= 10) {
      return updatedIndexList;
    }
  }
  return null;
}

function explodeFirstPair(snailFishGroup, indexList) {
  const indexArray = getIndexArray(snailFishGroup);
  const groupToExplode = snailFishGroup[indexList[0]][indexList[1]][indexList[2]][indexList[3]];
  const leftNumber = groupToExplode[0];
  const rightNumber = groupToExplode[1];

  const leftExplodeIndex = indexArray.indexOf(indexList.join('') + '0');
  const rightExplodeIndex = indexArray.indexOf(indexList.join('') + '1');
  const leftIndex = leftExplodeIndex > 0 ? leftExplodeIndex - 1 : -1;
  const rightIndex = rightExplodeIndex < indexArray.length - 1 ? rightExplodeIndex + 1 : -1;

  if (leftIndex >= 0) {
    addToValueAtIndex(snailFishGroup, indexArray[leftIndex].split(''), leftNumber);
  }
  if (rightIndex >= 0) {
    addToValueAtIndex(snailFishGroup, indexArray[rightIndex].split(''), rightNumber);
  }
  snailFishGroup[indexList[0]][indexList[1]][indexList[2]][indexList[3]] = 0;
}

function splitFirstDoubleDigit(snailFishGroup, indexList) {
  let valueToSplit = snailFishGroup;
  for (let i = 0; i < indexList.length; i++) {
    valueToSplit = valueToSplit[indexList[i]];
  }
  const leftValue = Math.floor(valueToSplit / 2);
  const rightValue = valueToSplit - leftValue;

  let valueToUpdate = snailFishGroup;
  for (let i = 0; i < indexList.length - 1; i++) {
    valueToUpdate = valueToUpdate[indexList[i]];
  }
  valueToUpdate[indexList.pop()] = [leftValue, rightValue];
}

function getIndexArray(snailFishGroup, currentIndices = [], indexArray = []) {
  for (let i = 0; i < snailFishGroup.length; i++) {
    let updatedIndices = currentIndices.concat(i);
    if (Array.isArray(snailFishGroup[i])) {
      getIndexArray(snailFishGroup[i], updatedIndices, indexArray);
    } else {
      indexArray.push(updatedIndices.join(''));
    }
  }
  return indexArray;
}

function addToValueAtIndex(snailFishGroup, indexList, value) {
  let currentValue = snailFishGroup;
  for (let i = 0; i < indexList.length; i++) {
    currentValue = currentValue[Number(indexList[i])];
  }

  let currentGroup = snailFishGroup;
  for (let i = 0; i < indexList.length - 1; i++) {
    currentGroup = currentGroup[Number(indexList[i])];
  }
  currentGroup[indexList.pop()] = currentValue + value;
}

function getMagnitude(snailFishGroup) {
  let leftValue = snailFishGroup[0];
  if (Array.isArray(leftValue)) {
    leftValue = getMagnitude(leftValue);
  }
  let rightValue = snailFishGroup[1];
  if (Array.isArray(rightValue)) {
    rightValue = getMagnitude(rightValue);
  }

  return (3 * Number(leftValue) + 2 * Number(rightValue));
}