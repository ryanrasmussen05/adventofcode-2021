import { getInput } from '../util/file-reader.js';
const input = await getInput('./day-16/input.txt');
let hexInput = input[0].split('');
let bitBuffer = [];

decodeNextPacket();


function getBits(numBits) {
  while(bitBuffer.length < numBits) {
    const nextHexChar = hexInput.shift();
    const byteString = parseInt(nextHexChar, 16).toString(2).padStart(4, '0');
    bitBuffer.push(...byteString.split(''));
  }

  return bitBuffer.splice(0, numBits);
}

function getPacketVersion() {
  const versionBits = getBits(3);
  const versionBinaryString = versionBits.join('');
  return parseInt(versionBinaryString, 2);
}

function getPacketTypeId() {
  const packetTypeIdBits = getBits(3);
  const packetTypeIdBinaryString = packetTypeIdBits.join('');
  return parseInt(packetTypeIdBinaryString, 2);
}

function getLengthTypeId() {
  return parseInt(getBits(1)[0], 2);
}

function decodeNextPacket() {
  debugger;
  const packetVersion = getPacketVersion();
  const packetTypeId = getPacketTypeId();

  if (packetTypeId === 4) decodeLiteralValue();
  decodeOperator();
}

function decodeLiteralValue() {
  let literalValueString = '';

  while (true) {
    let bitGroup = getBits(5);
    const isFinalGroup = bitGroup.shift() === 0;
    literalValueString += bitGroup.join();
    if (isFinalGroup) break;
  }
  // clear buffer?
  return parseInt(literalValueString, 2);
}

function decodeOperator() {
  const lengthTypeId = getLengthTypeId();

  if (lengthTypeId === 0) {
    // total length in bits of the sub-packets
    const totalLengthBits = getBits(15);
    const totalLengthBitsString = totalLengthBits.join('');
    const totalLength = parseInt(totalLengthBitsString, 2);
  }
}