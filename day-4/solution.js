import { getInput } from '../util/file-reader.js';

const input = await getInput('./day-4/input.txt');

const drawNumbers = input[0].split(',');
const boards = [];

let currIndex = 2;
while (currIndex < input.length) {
  boards.push(getBoard(currIndex));
  currIndex += 6;
}

// part 1
// for (let i = 0; i < drawNumbers.length; i++) {
//   const drawNumber = drawNumbers[i];
//   markBoards(drawNumber);
//   const winningBoard = findWinningBoard();
//
//   if (winningBoard) {
//     console.log('winner', winningBoard);
//     console.log('sum unmarked', sumUnmarkedNumbers(winningBoard));
//     console.log('last called number', drawNumber);
//     console.log('solution', sumUnmarkedNumbers(winningBoard) * drawNumber);
//     break;
//   }
// }

// part 2
let finalBoard = null;
for (let i = 0; i < drawNumbers.length; i++) {
  const drawNumber = drawNumbers[i];
  markBoards(drawNumber);

  if (!finalBoard) {
    let numWinners = 0;
    for (const board of boards) {
      if (isBoardWinner(board)) numWinners++;
    }
    if (numWinners === boards.length - 1) {
      finalBoard = findLosingBoard();
    }
  } else if (isBoardWinner(finalBoard)) {
    console.log('last winner', finalBoard);
    console.log('sum unmarked', sumUnmarkedNumbers(finalBoard));
    console.log('last called number', drawNumber);
    console.log('solution', sumUnmarkedNumbers(finalBoard) * drawNumber);
    break;
  }

  // find number of winners
  // if number winners is 1 less than length, find non-winners
}

function getBoard(startIndex) {
  const board = [];
  for (let i = 0; i < 5; i++) {
    let line = input[startIndex + i].split(' ');
    line = line.filter(num => num.length > 0);
    board.push(line.map(num => ({ num, marked: false })));
  }
  return board;
}

function markBoards(drawNumber) {
  for (const board of boards) {
    for (const line of board) {
      for (const entry of line) {
        if (entry.num === drawNumber) {
          entry.marked = true;
          break;
        }
      }
    }
  }
}

function findWinningBoard() {
  for (const board of boards) {
    if (isBoardWinner(board)) return board;
  }
}

function isBoardWinner(board) {
  // check rows
  for (const line of board) {
    const isWinner = line.every(entry => entry.marked);
    if (isWinner) return board;
  }
  // check columns
  for (let col = 0; col < 5; col++) {
    const isWinner = board.every(line => line[col].marked);
    if (isWinner) return board;
  }
}

function sumUnmarkedNumbers(board) {
  let sum = 0;
  for (const line of board) {
    for (const entry of line) {
      if (!entry.marked) sum += Number(entry.num);
    }
  }
  return sum;
}

function findLosingBoard() {
  for (const board of boards) {
    if (!isBoardWinner(board)) return board;
  }
}

