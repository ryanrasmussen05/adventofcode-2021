import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-6/input.txt');

let fishArray = input[0].split(',');
fishArray = fishArray.map(num => Number(num));

// part 1
for (let i = 1; i <= 80; i++) {
  simulateDay();
}
console.log(`After day 80: ${fishArray.length}`);

// part 2
fishArray = input[0].split(',');
fishArray = fishArray.map(num => Number(num));

let newFishTimeArray = [0,0,0,0,0,0,0,0,0];
fishArray.forEach(fish => {
  newFishTimeArray[fish]++;
})

for (let i = 1; i <= 256; i++) {
  calculateDay();
}
console.log(`After day 80: ${calculateTotal(newFishTimeArray)}`);


// naive
function simulateDay() {
  let numNewFish = 0;

  for (let i = 0; i < fishArray.length; i++) {
    const fishValue = fishArray[i];

    if (fishValue === 0) {
      fishArray[i] = 6;
      numNewFish++;
    } else {
      fishArray[i] = fishValue - 1;
    }
  }

  for (let i = 0; i < numNewFish; i++) {
    fishArray.push(8);
  }
}

// calculate
function calculateDay() {
  const new8 = newFishTimeArray[0];
  const new7 = newFishTimeArray[8];
  const new6 = newFishTimeArray[7] + newFishTimeArray[0];
  const new5 = newFishTimeArray[6];
  const new4 = newFishTimeArray[5];
  const new3 = newFishTimeArray[4];
  const new2 = newFishTimeArray[3];
  const new1 = newFishTimeArray[2];
  const new0 = newFishTimeArray[1];

  newFishTimeArray = [new0, new1, new2, new3, new4, new5, new6, new7, new8];
}

function calculateTotal() {
  const foo = newFishTimeArray;
  return foo[0] + foo[1] + foo[2] + foo[3] + foo[4] + foo[5] + foo[6] + foo[7] + foo[8];
}



