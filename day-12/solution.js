import { getInput } from '../util/file-reader.js';
const input = await getInput('./day-12/input.txt');

const caveConnections = buildCaveConnections();
const successfulPaths = [];
continuePath(['start']);
console.log(successfulPaths);

const successfulModifiedPaths = [];
continuePathModified(['start']);
console.log(successfulModifiedPaths);

function buildCaveConnections() {
  const foundConnections = {};
  input.forEach(line => {
    const caves = line.split('-');
    if (!foundConnections[caves[0]]) {
      foundConnections[caves[0]] = [];
    }
    if (!foundConnections[caves[1]]) {
      foundConnections[caves[1]] = [];
    }
    foundConnections[caves[0]].push(caves[1]);
    foundConnections[caves[1]].push(caves[0]);
  });
  return foundConnections;
}

function continuePath(path) {
  const currentCave = _.last(path);
  if (currentCave === 'end') {
    successfulPaths.push(path);
    return;
  }

  // find array of next possible destinations
  const possibleNextDestinations = caveConnections[currentCave];
  possibleNextDestinations.forEach(nextCave => {
    if (!path.includes(nextCave) || isUpperCase(nextCave)) {
      const nextPath = path.concat(nextCave);
      continuePath(nextPath);
    }
  });
}

function continuePathModified(path) {
  const currentCave = _.last(path);
  if (currentCave === 'end') {
    successfulModifiedPaths.push(path);
    return;
  }

  // find array of next possible destinations
  const possibleNextDestinations = caveConnections[currentCave];
  possibleNextDestinations.forEach(nextCave => {
    const nextPath = path.concat(nextCave);
    if (doesPathContainTwoOfSame(path)) {
      if (!path.includes(nextCave) || isUpperCase(nextCave)) {
        continuePathModified(nextPath);
      }
    } else {
      if (nextCave !== 'start') {
        continuePathModified(nextPath);
      }
    }
  });
}

function isUpperCase(cave) {
  return cave === cave.toUpperCase();
}

function doesPathContainTwoOfSame(path) {
  const filteredPath = path.filter(cave => {
    return cave.toLowerCase() === cave && cave !== 'start' && cave !== 'end';
  });
  const groupedCaves = _.groupBy(filteredPath);
  return Object.values(groupedCaves).some(caveGroup => {
    return caveGroup.length > 1;
  })
}