import { getInput } from '../util/file-reader.js';
const input = await getInput('./day-13/input.txt');

let dotPlot = buildDotPlot(input);
const foldInstructions = getFoldInstructions(input);

foldInstructions.forEach(instruction => {
  dotPlot = fold(dotPlot, instruction);
});
console.log(dotPlot);

function fold(dotPlotToFold, foldInstruction) {
  // vertical line fold
  if (foldInstruction.axis === 'x') {
    return foldVertically(dotPlot, foldInstruction.index);
  // horizontal line fold
  } else {
    return foldHorizontally(dotPlot, foldInstruction.index);
  }
}

function foldVertically(dotPlot, foldIndex) {
  const foldedDotPlot = [];

  dotPlot.forEach(row => {
    const newRow = [];

    let currLeftIndex = foldIndex - 1;
    let currRightIndex = foldIndex + 1;

    while (currLeftIndex >= 0) {
      const leftVal = row[currLeftIndex];
      const rightVal = row[currRightIndex];
      if (leftVal === '#' || rightVal === '#') {
        newRow[currLeftIndex] = '#';
      } else {
        newRow[currLeftIndex] = '.'
      }
      currLeftIndex--;
      currRightIndex++;
    }
    foldedDotPlot.push(newRow);
  });

  return foldedDotPlot;
}

function foldHorizontally(dotPlot, foldIndex) {
  const foldedDotPlot = [];

  let currTopIndex = foldIndex - 1;
  let currBottomIndex = foldIndex + 1;

  while (currTopIndex >= 0) {
    const topRow = dotPlot[currTopIndex];
    const bottomRow = dotPlot[currBottomIndex];
    foldedDotPlot[currTopIndex] = combineRows(topRow, bottomRow);
    currTopIndex--;
    currBottomIndex++;
  }

  return foldedDotPlot;
}

function combineRows(rowA, rowB) {
  const newRow = [];
  for (let i = 0; i < rowA.length; i++) {
    newRow[i] = '.';
    if (rowA[i] === '#' || rowB[i] === '#') {
      newRow[i] = '#';
    }
  }
  return newRow;
}

function buildDotPlot(input) {
  let currDotPlot = new Array(1310).fill([]);
  currDotPlot = currDotPlot.map(line => {
    return new Array(1310).fill('.');
  });

  input.forEach(line => {
    const parts = line.split(',').map(part => Number(part));
    if (parts.length === 2) {
      currDotPlot[parts[1]][parts[0]] = '#';
    }
  });

  return currDotPlot;
}

function getFoldInstructions(input) {
  let currInstructions = [];

  input.forEach(line => {
    const parts = line.split(' ');
    if (parts.length === 3) {
      const instructionParts = parts[2].split('=');
      currInstructions.push({
        axis: instructionParts[0],
        index: Number(instructionParts[1]),
      });
    }
  });

  return currInstructions;
}

function getDotCount(plot) {
  let count = 0;

  plot.forEach(line => {
    line.forEach(cell => {
      if (cell === '#') count++
    })
  });

  return count;
}