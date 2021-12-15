import { getInput } from '../util/file-reader.js';
const input = await getInput('./day-15/input.txt');

const riskMap = buildRiskMap();
const visitedNodes = new Set();

// while (visitedNodes.size < 10000) {
//   visitNode(getNextNodeToVisit());
// }
//console.log(riskMap);

console.log(buildExpandedRiskMap());

function buildRiskMap() {
  const map = [];
  input.forEach((row, rowIndex) => {
    const rowRep = [];
    row.split('').forEach((col, colIndex) => {
      rowRep.push({
        costToEnter: Number(col),
        lowestTotalRisk: Number.MAX_SAFE_INTEGER,
        rowIndex: rowIndex,
        colIndex: colIndex,
      });
    });
    map.push(rowRep);
  });
  map[0][0].lowestTotalRisk = 0;
  return map;
}

function getNextNodeToVisit() {
  let currentLowestNode = { lowestTotalRisk: Number.POSITIVE_INFINITY };
  riskMap.forEach(row => {
    row.forEach(location => {
      if (location.lowestTotalRisk < currentLowestNode.lowestTotalRisk && !hasNodeBeenVisited(location)) {
        currentLowestNode = location;
      }
    });
  });
  return currentLowestNode;
}

function hasNodeBeenVisited(node) {
  if (!node) {
    debugger;
  }
  const nodeKey = `${node.rowIndex},${node.colIndex}`;
  return visitedNodes.has(nodeKey);
}

function markNodeAsVisited(node) {
  const nodeKey = `${node.rowIndex},${node.colIndex}`;
  visitedNodes.add(nodeKey);
}

function visitNode(node) {
  // top
  if (node.rowIndex > 0) {
    const topNode = riskMap[node.rowIndex - 1][node.colIndex];
    const newLowestRisk = node.lowestTotalRisk + topNode.costToEnter;
    if (!hasNodeBeenVisited(topNode) && newLowestRisk < topNode.lowestTotalRisk) topNode.lowestTotalRisk = newLowestRisk;
  }
  // bottom
  if (node.rowIndex + 1 < 100) {
    const bottomNode = riskMap[node.rowIndex + 1][node.colIndex];
    const newLowestRisk = node.lowestTotalRisk + bottomNode.costToEnter;
    if (!hasNodeBeenVisited(bottomNode) && newLowestRisk < bottomNode.lowestTotalRisk) bottomNode.lowestTotalRisk = newLowestRisk;
  }
  // left
  if (node.colIndex > 0) {
    const leftNode = riskMap[node.rowIndex][node.colIndex - 1];
    const newLowestRisk = node.lowestTotalRisk + leftNode.costToEnter;
    if (!hasNodeBeenVisited(leftNode) && newLowestRisk < leftNode.lowestTotalRisk) leftNode.lowestTotalRisk = newLowestRisk;
  }
  // right
  if (node.colIndex + 1 < 100) {
    const rightNode = riskMap[node.rowIndex][node.colIndex + 1];
    const newLowestRisk = node.lowestTotalRisk + rightNode.costToEnter;
    if (!hasNodeBeenVisited(rightNode) && newLowestRisk < rightNode.lowestTotalRisk) rightNode.lowestTotalRisk = newLowestRisk;
  }
  markNodeAsVisited(node);
}

function buildExpandedRiskMap() {
  const map = [];

  for(let row = 0; row < 500; row++) {
    map[row] = [];
    for( let col = 0; col < 500; col++) {
      if (row < 100 && col < 100) {
        map[row][col] = riskMap[row][col];
      } else if (col >= 100) {
        map[row][col] = {
          costToEnter: incrementedValue(map[row][col - 100].costToEnter),
          lowestTotalRisk: Number.MAX_SAFE_INTEGER,
          rowIndex: row,
          colIndex: col,
        };
      } else {
        map[row][col] = {
          costToEnter: incrementedValue(map[row - 100][col].costToEnter),
          lowestTotalRisk: Number.MAX_SAFE_INTEGER,
          rowIndex: row,
          colIndex: col,
        };
      }
    }
  }
  return map;
}

function incrementedValue(value) {
  if (value === 9) return 1;
  return value + 1;
}



