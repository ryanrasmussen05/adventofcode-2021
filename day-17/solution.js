const targetX = [265, 287];
const targetY = [-103, -58];

const possibleXVelocities = findPossibleXVelocities();
const possibleYVelocities = findPossibleYVelocities();
const possibleVelocities = findValidVelocityCombos(possibleXVelocities, possibleYVelocities);
console.log(possibleVelocities);

console.log(_.max(possibleVelocities.map(vel => vel.maxHeight)));
console.log(possibleVelocities.length);

function findPossibleXVelocities() {
  const maxXVelocity = targetX[1];
  const possibleVelocities = [];

  for (let i = 1; i <= maxXVelocity; i++) {
    let currentVelocity = i;
    let xPosition = 0;
    let numSteps = 0;

    while (xPosition <= targetX[1]) {
      if (targetX[0] <= xPosition && targetX[1] >= xPosition) {
        possibleVelocities.push(i);
        break;
      }
      const lastXPosition = xPosition;
      xPosition += currentVelocity;
      currentVelocity--;
      numSteps++;
      if (xPosition === lastXPosition) break;
    }
  }
  return possibleVelocities;
}

function findPossibleYVelocities() {
  const possibleYVelocities = [];
  const minYVelocity = targetY[0];
  const maxYVelocity = Math.abs(minYVelocity);

  for (let testVelocity = minYVelocity; testVelocity <= maxYVelocity; testVelocity++) {
    if (isYVelocityPossible(testVelocity)) {
      possibleYVelocities.push(testVelocity);
    }
  }
  return possibleYVelocities;
}

function isYVelocityPossible(velocity) {
  let yVelocity = velocity;
  let yPosition = 0;

  while (yPosition >= targetY[0]) {
    if (targetY[0] <= yPosition && targetY[1] >= yPosition) {
      return true;
    }
    if (yPosition < targetY[0]) return false;
    yPosition += yVelocity;
    yVelocity--;
  }
}

function findValidVelocityCombos(possibleXVelocities, possibleYVelocities) {
  const validCombos = [];
  for (const xVelocity of possibleXVelocities) {
    for (const yVelocity of possibleYVelocities) {
      if (isValidVelocityCombo(xVelocity, yVelocity)) {
        validCombos.push({
          x: xVelocity,
          y: yVelocity,
          maxHeight: calculateMaxHeightForVelocity(yVelocity),
        });
      }
    }
  }
  return validCombos;
}

function isValidVelocityCombo(xVel, yVel) {
  let xPosition = 0;
  let yPosition = 0;
  let xVelocity = xVel;
  let yVelocity = yVel;

  while (yPosition >= targetY[0]) {
    if (targetY[0] <= yPosition && targetY[1] >= yPosition && targetX[0] <= xPosition && targetX[1] >= xPosition) {
      return true;
    }
    yPosition += yVelocity;
    yVelocity -= 1;
    xPosition += xVelocity;
    if (xVelocity > 0) xVelocity -= 1;
  }

  return false;
}


function calculateMaxHeightForVelocity(yVelocity) {
  let maxHeight = 0;
  let currentVelocity = yVelocity;

  while (currentVelocity > 0) {
    maxHeight += currentVelocity;
    currentVelocity--;
  }

  return maxHeight;
}
