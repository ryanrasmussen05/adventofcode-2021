import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-9/input.txt');

const smokePlot = [];
input.forEach(line => {
  const cells = line.split('').map(cell => Number(cell));
  smokePlot.push(cells);
})

// part 1
console.log(getRiskLevel(smokePlot));

// part 2
const range = smokePlot.length;
const basinSizes = [];
for (let row = 0; row < range; row++) {
  for (let col = 0; col < range; col++) {
    if (isLowPoint(smokePlot, row, col)) {
      basinSizes.push(getBasinSize(row, col, smokePlot));
    }
  }
}
basinSizes.sort((a,b) => b - a);
console.log(basinSizes[0] * basinSizes[1] * basinSizes[2]);


function getRiskLevel(plot) {
  let totalRisk = 0;
  const range = plot.length;

  for (let row = 0; row < range; row++) {
    for (let col = 0; col < range; col++) {
      if (isLowPoint(plot, row, col)) {
        totalRisk += (plot[row][col] + 1);
      }
    }
  }
  return totalRisk;
}

function isLowPoint(plot, rowIndex, colIndex) {
  const topNeighbor = rowIndex > 0 ? plot[rowIndex - 1][colIndex] : 10;
  const bottomNeighbor = rowIndex < plot.length - 1 ? plot[rowIndex + 1][colIndex] : 10;
  const leftNeighbor = colIndex > 0 ? plot[rowIndex][colIndex - 1] : 10;
  const rightNeighbor = colIndex < plot.length - 1 ? plot[rowIndex][colIndex + 1] : 10;

  const pointValue = plot[rowIndex][colIndex];

  return pointValue < topNeighbor && pointValue < bottomNeighbor && pointValue < leftNeighbor && pointValue < rightNeighbor;
}

function getBasinSize(rowIndex, colIndex, plot) {
  let visitedPoints = [pointToString(rowIndex, colIndex)];
  traversePoint(rowIndex, colIndex, visitedPoints, plot);
  return visitedPoints.length;
}

function traversePoint(rowIndex, colIndex, visitedPoints, plot) {
  const pointValue = plot[rowIndex][colIndex];
  // left
  const leftNeighbor = colIndex > 0 ? plot[rowIndex][colIndex - 1] : -1;
  if (leftNeighbor > pointValue && leftNeighbor !== 9 && !isPointVisited(rowIndex, colIndex - 1, visitedPoints)) {
    visitPoint(rowIndex, colIndex - 1, visitedPoints, plot);
  }
  // right
  const rightNeighbor = colIndex < plot.length - 1 ? plot[rowIndex][colIndex + 1] : -1;
  if (rightNeighbor > pointValue && rightNeighbor !== 9 && !isPointVisited(rowIndex, colIndex + 1, visitedPoints)) {
    visitPoint(rowIndex, colIndex + 1, visitedPoints, plot);
  }
  // top
  const topNeighbor = rowIndex > 0 ? plot[rowIndex - 1][colIndex] : -1;
  if (topNeighbor > pointValue && topNeighbor !== 9 && !isPointVisited(rowIndex - 1, colIndex, visitedPoints)) {
    visitPoint(rowIndex - 1, colIndex, visitedPoints, plot);
  }
  // bottom
  const bottomNeighbor = rowIndex < plot.length - 1 ? plot[rowIndex + 1][colIndex] : -1;
  if (bottomNeighbor > pointValue && bottomNeighbor !== 9 && !isPointVisited(rowIndex + 1, colIndex, visitedPoints)) {
    visitPoint(rowIndex + 1, colIndex, visitedPoints, plot);
  }
}

function isPointVisited(rowIndex, colIndex, visitedPoints) {
  return visitedPoints.includes(pointToString(rowIndex, colIndex));
}

function pointToString(rowIndex, colIndex) {
  return `${rowIndex},${colIndex}`;
}

function visitPoint(rowIndex, colIndex, visitedPoints, plot) {
  visitedPoints.push(pointToString(rowIndex, colIndex));
  traversePoint(rowIndex, colIndex, visitedPoints, plot);
}


