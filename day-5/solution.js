import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-5/input.txt');

const ventLines = [];
input.forEach(line => {
  ventLines.push(getVentLine(line));
});

const ventPlot = [];
for (let i = 0; i < 1000; i++) {
  ventPlot.push(new Array(1000).fill(0));
}

// part one
// ventLines.forEach(ventLine => {
//   if (isHorizontalOrVertical(ventLine)) {
//     addVentLineToPlot(ventLine);
//   }
// });
// let overlapPoints = 0;
// ventPlot.forEach(row => {
//   row.forEach(cell => {
//     if (cell > 1) overlapPoints++;
//   });
// });
// console.log(overlapPoints);

// part two
ventLines.forEach(ventLine => {
  addVentLineToPlot(ventLine);
});
let overlapPoints = 0;
ventPlot.forEach(row => {
  row.forEach(cell => {
    if (cell > 1) overlapPoints++;
  });
});
console.log(overlapPoints);

function getVentLine(inputLine) {
  const coords = inputLine.split('->');
  const fromCoordsString = coords[0].trim();
  const toCoordsString = coords[1].trim();

  const fromCoordsParts = fromCoordsString.split(',');
  const toCoordsParts = toCoordsString.split(',');

  return {
    from: { x: Number(fromCoordsParts[0]), y: Number(fromCoordsParts[1]) },
    to: { x: Number(toCoordsParts[0]), y: Number(toCoordsParts[1]) },
  };
}

function isHorizontalOrVertical(ventLine) {
  return ventLine.from.x === ventLine.to.x || ventLine.from.y === ventLine.to.y;
}

function addVentLineToPlot({ from, to }) {
  // horizontal
  if (from.y === to.y) {
    const start = from.x <= to.x ? from.x : to.x;
    const end = from.x > to.x ? from.x : to.x;
    for (let i = start; i <= end; i++) {
      ventPlot[from.y][i]++;
    }
  // vertical
  } else if (from.x === to.x) {
    const start = from.y <= to.y ? from.y : to.y;
    const end = from.y > to.y ? from.y : to.y;
    for (let i = start; i <= end; i++) {
      ventPlot[i][from.x]++;
    }
  // diagonal
  } else {
    const leftCoord = from.x < to.x ? from : to;
    const rightCoord = from.x > to.x ? from : to;
    let currY = leftCoord.y;
    const isIncreasing = leftCoord.y < rightCoord.y;
    for (let i = leftCoord.x; i <= rightCoord.x; i++) {
      ventPlot[currY][i]++;
      currY = isIncreasing ? currY + 1 : currY - 1;
    }
  }
}

