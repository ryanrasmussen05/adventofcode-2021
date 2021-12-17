import { getInput } from '../util/file-reader.js';
const input = await getInput('./day-16/input.txt');
let hexInput = input[0].split('');
// let hexInput = '9C0141080250320F1802104A08'.split('');
let bitBuffer = [];

const packet = decodeNextPacket();
console.log(evaluatePacket(packet));


function getBits(numBits) {
  while(bitBuffer.length < numBits) {
    if (hexInput.length === 0) throw new Error();
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
  const packetVersion = getPacketVersion();
  const packetTypeId = getPacketTypeId();

  if (packetTypeId === 4) return decodeLiteralValue();
  return decodeOperator(packetTypeId);
}

function decodeLiteralValue() {
  let literalValueString = '';
  let bitCount = 6;

  while (true) {
    let bitGroup = getBits(5);
    bitCount += 5;
    const isFinalGroup = bitGroup.shift() === '0';
    literalValueString += bitGroup.join('');
    if (isFinalGroup) break;
  }

  return { value: parseInt(literalValueString, 2), bitCount, type: 'literal' };
}

function decodeOperator(packetTypeId) {
  const lengthTypeId = getLengthTypeId();
  const subPackets = [];
  let totalBitCount = 7;

  if (lengthTypeId === 0) {
    // total length in bits of the sub-packets
    const totalLengthBits = getBits(15);
    totalBitCount += 15;
    const totalLengthBitsString = totalLengthBits.join('');
    let remainingLength = parseInt(totalLengthBitsString, 2);

    do {
      const decodedPacket = decodeNextPacket();
      subPackets.push(decodedPacket);
      const bitCount = decodedPacket.bitCount;
      remainingLength -= bitCount;
      totalBitCount += bitCount;
    } while(remainingLength > 0);

  } else if (lengthTypeId === 1) {
    // total number of sub-packets
    const totalSubpacketsBits = getBits(11);
    totalBitCount += 11;
    const totalSubpacketsBitsString = totalSubpacketsBits.join('');
    const totalSubpackets = parseInt(totalSubpacketsBitsString, 2);

    for (let i = 0; i < totalSubpackets; i++) {
      const decodedPacket = decodeNextPacket();
      subPackets.push(decodedPacket);
      totalBitCount += decodedPacket.bitCount;
    }
  }

  return { subPackets, bitCount: totalBitCount, type: 'operator', operation: getOperatorType(packetTypeId) };
}

function getOperatorType(packetTypeId) {
  switch (packetTypeId) {
    case 0: return 'sum';
    case 1: return 'product';
    case 2: return 'minimum';
    case 3: return 'maximum';
    case 5: return 'greater than';
    case 6: return 'less than';
    case 7: return 'equal to';
  }
}

function evaluatePacket(packet) {
  if (packet.type === 'literal') return packet.value;

  switch (packet.operation) {
    case 'sum': return evalSum(packet);
    case 'product': return evalProduct(packet);
    case 'minimum': return evalMinimum(packet);
    case 'maximum': return evalMaximum(packet);
    case 'greater than': return evalGreaterThan(packet);
    case 'less than': return evalLessThan(packet);
    case 'equal to': return evalEqualTo(packet);
  }
}

function evalSum(packet) {
  let sum = 0;
  for (let subPacket of packet.subPackets) {
    sum += evaluatePacket(subPacket);
  }
  return sum;
}

function evalProduct(packet) {
  let product = null;
  for (let subPacket of packet.subPackets) {
    if (!product) product = evaluatePacket(subPacket);
    else product = product * evaluatePacket(subPacket);
  }
  return product;
}

function evalMinimum(packet) {
  let values = [];
  for (let subPacket of packet.subPackets) {
    values.push(evaluatePacket(subPacket));
  }
  return _.min(values);
}

function evalMaximum(packet) {
  let values = [];
  for (let subPacket of packet.subPackets) {
    values.push(evaluatePacket(subPacket));
  }
  return _.max(values);
}

function evalGreaterThan(packet) {
  let packet1 = evaluatePacket(packet.subPackets[0]);
  let packet2 = evaluatePacket(packet.subPackets[1]);
  return packet1 > packet2 ? 1 : 0;
}

function evalLessThan(packet) {
  let packet1 = evaluatePacket(packet.subPackets[0]);
  let packet2 = evaluatePacket(packet.subPackets[1]);
  return packet1 < packet2 ? 1 : 0;
}

function evalEqualTo(packet) {
  let packet1 = evaluatePacket(packet.subPackets[0]);
  let packet2 = evaluatePacket(packet.subPackets[1]);
  return packet1 === packet2 ? 1 : 0;
}