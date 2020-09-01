import BigNumber from 'bignumber.js';

// Do the storage lookup based on the contract layout in solidity:
// https://solidity.readthedocs.io/en/v0.5.3/miscellaneous.html#layout-of-state-variables-in-storage
async function findInStorage(web3, address, key, slot, increment) {
  let newKey = web3.utils.soliditySha3({ type: "uint", value: key }, {type: "uint", value: slot});
  newKey = increaseBy(newKey, increment);
  let value = await web3.eth.getStorageAt(address, newKey);
  return { newKey, value };
}

function increaseBy(hex, n) {
  let sum = new BigNumber(hex).plus(n);
  return '0x' + sum.toString(16);
}

export default findInStorage;