import config from "../config";
import async from 'async';
import bigInt from 'big-integer';
import {
  CLAIM,
  CLAIM_RETURNED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  ERROR,
  EXIT,
  EXIT_RETURNED,
  GET_BALANCES,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  GET_BALANCES_RETURNED,
  GET_CLAIMABLE,
  GET_CLAIMABLE_ASSET,
  GET_CLAIMABLE_ASSET_RETURNED,
  GET_CLAIMABLE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  GET_GOV_REQUIREMENTS,
  GET_GOV_REQUIREMENTS_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  STAKE,
  STAKE_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED
} from '../constants';
import Web3 from 'web3';

import {
  authereum,
  fortmatic,
  frame,
  injected,
  ledger,
  portis,
  squarelink,
  torus,
  trezor,
  walletconnect,
  walletlink
} from "./connectors";

const rp = require('request-promise');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
      currentBlock: 0,
      universalGasPrice: '70',
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        },
        {
          language: 'Japanese',
          code: 'ja'
        },
        {
          language: 'Chinese',
          code: 'zh'
        }
      ],
      proposals: [
      ],
      // claimableAsset: {
      //   id: 'YFL',
      //   name: 'YFLink',
      //   address: config.yflAddress,
      //   abi: config.yflABI,
      //   symbol: 'YFL',
      //   balance: 0,
      //   decimals: 18,
      //   rewardAddress: '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d',
      //   rewardSymbol: 'aDAI',
      //   rewardDecimals: 18,
      //   claimableBalance: 0
      // },
      rewardPools: [
        {
          id: 'pool0',
          title: 'Pool 0',
          name: 'LINK',
          website: 'ChainLink Token',
          link: 'https://etherscan.io/token/' + config.pool0StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-0-link/24',
          yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool0",
          depositsEnabled: true,
          tokens: [
            {
              id: 'link',
              address: config.pool0StakeAddress,
              symbol: 'LINK',
              abi: config.erc20ABI,
              rewardsAddress: config.pool0Address,
              rewardsABI: config.pool0ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'pool1',
          title: 'Pool 1',
          name: 'LINK/YFL Balancer',
          website: 'Balancer Pool',
          link: 'https://pools.balancer.exchange/#/pool/' + config.pool1StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-1-link-yfl-balancer/25',
          yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool1",
          depositsEnabled: true,
          tokens: [
            {
              id: 'bpt',
              address: config.pool1StakeAddress,
              symbol: 'BPT',
              abi: config.erc20ABI,
              rewardsAddress: config.pool1Address,
              rewardsABI: config.pool1ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'gov',
          title: 'Gov',
          name: 'Governance',
          website: 'YFLINK Token',
          link: 'https://yflink.io',
          instructionsLink: 'https://gov.yflink.io/t/staking-in-the-governance-contract/28',
          depositsEnabled: true,
          tokens: [
            {
              id: 'yfl',
              address: config.yflAddress,
              symbol: 'YFL',
              abi: config.yflABI,
              rewardsAddress: config.governanceAddress,
              rewardsABI: config.governanceABI,
              rewardsSymbol: null, // No rewards
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'pool2',
          title: 'Pool 2',
          name: 'yCRV/YFL Balancer',
          website: 'Balancer Pool',
          link: 'https://pools.balancer.exchange/#/pool/' + config.pool2StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-2-ycrv-yfl-balancer/26',
          // yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool2",
          depositsEnabled: true,
          startDate: config.pool2StartDate,
          tokens: [
            {
              id: 'bpt',
              address: config.pool2StakeAddress,
              symbol: 'BPT',
              abi: config.erc20ABI,
              rewardsAddress: config.pool2Address,
              rewardsABI: config.pool2ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'pool3',
          title: 'Pool 3',
          name: 'aLINK/YFL Balancer',
          website: 'Balancer Pool',
          link: 'https://pools.balancer.exchange/#/pool/' + config.pool3StakeAddress,
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-pool-3-alink-yfl-balancer/27',
          // yieldCalculator: "https://yieldfarming.yflink.io/yflink/pool3",
          depositsEnabled: true,
          startDate: config.pool3StartDate,
          tokens: [
            {
              id: 'bpt',
              address: config.pool3StakeAddress,
              symbol: 'BPT',
              abi: config.erc20ABI,
              rewardsAddress: config.pool3Address,
              rewardsABI: config.pool3ABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
        {
          id: 'govrewards',
          title: 'Gov Rewards',
          name: 'Governance + Rewards',
          website: 'YFLINK Token',
          link: 'https://yflink.io',
          instructionsLink: 'https://gov.yflink.io/t/mining-yfl-in-the-governance-rewards-contract/29',
          // yieldCalculator: 'https://yieldfarming.yflink.io/yflink/govrewards',
          depositsEnabled: true,
          startDate: config.governanceRewardsStartDate,
          tokens: [
            {
              id: 'yfl',
              address: config.yflAddress,
              symbol: 'YFL',
              abi: config.yflABI,
              rewardsAddress: config.governanceRewardsAddress,
              rewardsABI: config.governanceRewardsABI,
              rewardsSymbol: 'YFL',
              decimals: 18,
              balance: bigInt(),
              stakedBalance: bigInt(),
              rewardsAvailable: bigInt()
            }
          ]
        },
      ]
    }

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case GET_BALANCES_PERPETUAL:
            this.getBalancesPerpetual(payload);
            break;
          case STAKE:
            this.stake(payload);
            break;
          case WITHDRAW:
            this.withdraw(payload);
            break;
          case GET_REWARDS:
            this.getReward(payload);
            break;
          case EXIT:
            this.exit(payload);
            break;
          case PROPOSE:
            this.propose(payload)
            break;
          case GET_PROPOSALS:
            this.getProposals(payload)
            break;
          case VOTE_FOR:
            this.voteFor(payload)
            break;
          case VOTE_AGAINST:
            this.voteAgainst(payload)
            break;
          case GET_CLAIMABLE_ASSET:
            this.getClaimableAsset(payload)
            break;
          case CLAIM:
            this.claim(payload)
            break;
          case GET_CLAIMABLE:
            this.getClaimable(payload)
            break;
          case GET_GOV_REQUIREMENTS:
            this.getGovRequirements(payload)
            break;
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    return emitter.emit('StoreUpdated');
  };

  configure = async () => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber()

    store.setStore({ currentBlock: currentBlock })

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED)
    }, 100)
  }

  getBalancesPerpetual = async () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber()
    store.setStore({ currentBlock: currentBlock })

    async.map(pools, (pool, callback) => {
      async.map(pool.tokens, (token, callbackInner) => {
        async.parallel([
          (callbackInnerInner) => {this._getERC20Balance(web3, token, account, callbackInnerInner)},
          (callbackInnerInner) => {this._getstakedBalance(web3, token, account, callbackInnerInner)},
          (callbackInnerInner) => {this._getRewardsAvailable(web3, token, account, callbackInnerInner)}
        ], (err, data) => {
          if (err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if (err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })
    }, (err, poolData) => {
      if (err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED)
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  getBalances = () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(pools, (pool, callback) => {
      async.map(pool.tokens, (token, callbackInner) => {
        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);
      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      if(bigInt(allowance).lesser(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    if(bigInt(allowance).lesser(amount)) {
      erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(_hash){
          callback()
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    } else {
      callback()
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    try {
      let balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    try {
      let balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    if (!asset.rewardsSymbol) {
      callback(null, bigInt(0))
      return
    }
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    try {
      let earned = await erc20Contract.methods.earned(account.address).call({ from: account.address });
      callback(null, bigInt(earned))
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    if(bigInt(allowance).lesser(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    try {
      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(_hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  stake = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._checkApproval(asset, account, amount, asset.rewardsAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callStake(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res)
      })
    })
  }

  _callStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.stake(amount.toString()).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdraw = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callWithdraw(asset, account, amount, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }

  _callWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.withdraw(amount.toString()).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getReward = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callGetReward(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_REWARDS_RETURNED, res)
    })
  }

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.getReward().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  exit = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callExit(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res)
    })
  }

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const rewardsContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    rewardsContract.methods.exit().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  propose = (payload) => {
    const account = store.getStore('account')
    const { url } = payload.content

    this._callPropose(account, url, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(PROPOSE_RETURNED, res)
    })
  }

  _callPropose = async (account, url, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)
    const call = governanceContract.methods.propose(url)

    call.send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getProposals = (_payload) => {
    // emitter.emit(GET_PROPOSALS_RETURNED)
    const account = store.getStore('account')
    const web3 = new Web3(store.getStore('web3context').library.provider);

    this._getProposalCount(web3, account, (err, proposalCount) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      let arr = Array.from(Array(parseInt(proposalCount)).keys())

      if(proposalCount === 0) {
        arr = []
      }

      async.map(arr, (proposal, callback) => {
        this._getProposals(web3, account, proposal, callback)
      }, (err, proposalsData) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        store.setStore({ proposals: proposalsData })
        emitter.emit(GET_PROPOSALS_RETURNED)
      })

    })
  }

  _getProposalCount = async (web3, account, callback) => {
    try {
      const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)
      let proposals = await governanceContract.methods.proposalCount().call({ from: account.address });
      callback(null, proposals)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getProposals = async (web3, account, number, callback) => {
    try {
      const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)
      let proposal = await governanceContract.methods.proposals(number).call({ from: account.address });
      callback(null, proposal)
    } catch(ex) {
      return callback(ex)
    }
  }

  voteFor = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteFor(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_FOR_RETURNED, res)
    })
  }

  _callVoteFor = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)

    governanceContract.methods.voteFor(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  voteAgainst = (payload) => {
    const account = store.getStore('account')
    const { proposal } = payload.content

    this._callVoteAgainst(proposal, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_AGAINST_RETURNED, res)
    })
  }

  _callVoteAgainst = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const governanceContract = new web3.eth.Contract(config.governanceABI, config.governanceAddress)

    governanceContract.methods.voteAgainst(proposal.id).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimableAsset = (_payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_ASSET_RETURNED)
    })
  }

  _getClaimableBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.abi, asset.address)

    try {
      let balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getClaimable = async (web3, asset, account, callback) => {
    let claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    try {
      let balance = await claimContract.methods.claimable(account.address).call({ from: account.address });
      callback(null, bigInt(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  claim = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')
    const { amount } = payload.content

    this._checkApproval(asset, account, amount, config.claimAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res)
      })
    })
  }

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)
    claimContract.methods.claim(amount.toString()).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimable = (_payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_RETURNED)
    })
  }

  getGovRequirements = async (_payload) => {
    try {
      const account = store.getStore('account')
      const web3 = new Web3(store.getStore('web3context').library.provider);
      const governanceContract = new web3.eth.Contract(config.governanceABI,config.governanceAddress)

      // let balance = await governanceContract.methods.balanceOf(account.address).call({ from: account.address })
      // balance = bigInt(balance)

      const voteLock = await governanceContract.methods.voteLock(account.address).call({ from: account.address })
      const currentBlock = await web3.eth.getBlockNumber()

      const returnOBJ = {
        balanceValid: true,
        voteLockValid: voteLock > currentBlock,
        voteLock: voteLock
      }

      emitter.emit(GET_GOV_REQUIREMENTS_RETURNED, returnOBJ)
    } catch(ex) {
      return emitter.emit(ERROR, ex);
    }
  }

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }
}

const store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
