import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-7/input.txt');

const strings = input[0].split(',');
const crabPositions = strings.map(str => Number(str));

// part 1
const crabRange = getLargest(crabPositions);
let minFuel = Number.MAX_SAFE_INTEGER;
let minFuelPosition = 0;

for (let i = 0; i <= crabRange; i++) {
  const fuel = getTotalFuelForPositionSimple(i);
  if (fuel < minFuel) {
    minFuel = fuel;
    minFuelPosition = i;
  }
}
console.log(`${minFuel} fuel at position ${minFuelPosition}`);

// part 2
const fuelCostIndex = generateStepCostArray(crabRange);

minFuel = Number.MAX_SAFE_INTEGER;
for (let i = 0; i <= crabRange; i++) {
  const fuel = getTotalFuelForPosition(i);
  if (fuel < minFuel) {
    minFuel = fuel;
    minFuelPosition = i;
  }
}
console.log(`${minFuel} fuel at position ${minFuelPosition}`);


function getLargest(numbers) {
  return Math.max(...numbers);
}

function getTotalFuelForPositionSimple(position) {
  let totalFuel = 0;
  crabPositions.forEach(crabPosition => {
    const crabFuel = Math.abs(crabPosition - position);
    totalFuel += crabFuel;
  })
  return totalFuel;
}

function generateStepCostArray(totalPositions) {
  const map = [0];
  for (let i = 1; i <= totalPositions; i++) {
    map[i] = i + map[i-1];
  }
  return map;
}

function getTotalFuelForPosition(position) {
  let totalFuel = 0;
  crabPositions.forEach(crabPosition => {
    const crabFuel = fuelCostIndex[Math.abs(crabPosition - position)];
    totalFuel += crabFuel;
  })
  return totalFuel;
}





