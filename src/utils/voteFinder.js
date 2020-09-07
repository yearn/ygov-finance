import BigNumber from 'bignumber.js';
import findInStorage from './storageHelper.js';

function toNumber(hex) {
  return new BigNumber(hex).toNumber();
}
/**
  Trying to find the current votes for a wallet. The user has either voted FOR or AGAINST or has not yet voted at all.
  We have to find the right proposal struct from the proposals mapping on-chain and extract the forVotes and againstVotes mappings.
  Once we have the mappings we can look up the votes and because the contract guarantees that a wallet can be either only FOR or only AGAINST a YIP.
  We can extract the votes and return them to the frontend components.
 */
async function getMyVotes(web3, contractAddress, walletAddress, proposalId) {
  // slot number for proposals mapping that we have to unpack. it's magic.
  let proposalsSlot = 6;

  // forVotes is at index 2
  let { newKey: forVotesKey } = await findInStorage(web3, contractAddress, proposalId, proposalsSlot, 2);
  // againstVotes is at index 3
  let { newKey: againstVotesKey } = await findInStorage(web3, contractAddress, proposalId, proposalsSlot, 3);

  // get the forVotes values for the current wallet
  let { value: forVotes } = await findInStorage(web3, contractAddress, walletAddress, forVotesKey, 0);

  // get the againstVotes values for the current wallet
  let { value: againstVotes } = await findInStorage(web3, contractAddress, walletAddress, againstVotesKey, 0);

  let votes = 0;
  let direction = "NONE";

  if (forVotes > 0) {
    votes = forVotes;
    direction = "FOR";
  } else if (againstVotes > 0) {
    votes = againstVotes;
    direction = "AGAINST";
  }

  return {
    myVotes: toNumber(votes),
    direction
  };
}

export default getMyVotes;