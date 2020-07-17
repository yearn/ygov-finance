import config from "../config";
import async from 'async';
import * as moment from 'moment';
import {
  ERROR,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum
} from "./connectors";

const ethers = require('ethers');

const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {

    this.store = {
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
      rewardPools: [
        {
          id: 'yearn',
          name: 'yearn.finance',
          website: 'https://yearn.finance',
          tokens: [
            {
              id: 'ycurvefi',
              address: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
              symbol: 'curve.fi',
              abi: config.erc20ABI,
              decimals: 18,
              fyiAddress: config.yCurveFiRewardsAddress,
              fyiABI: config.yCurveFiRewardsABI,
              yfiSymbol: 'YFI',
              decimals: 18,
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0
            }
            // {
            //   id: 'ydaiv3',
            //   address: '0xC2cB1040220768554cf699b0d863A3cd4324ce32',
            //   symbol: 'yDAI',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 18
            // },
            // {
            //   id: 'yusdcv3',
            //   address: '0x26EA744E5B887E5205727f55dFBE8685e3b21951',
            //   symbol: 'yUSDC',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 6
            // },
            // {
            //   id: 'yUSDTv3',
            //   address: '0xE6354ed5bC4b393a5Aad09f21c46E101e692d447',
            //   symbol: 'yUSDT',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 6
            // },
            // {
            //   id: 'ybusdv3',
            //   address: '0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE',
            //   symbol: 'yBUSD',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 18
            // },
            // {
            //   id: 'ydaiv2',
            //   address: '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01',
            //   symbol: 'yDAI',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 18
            // },
            // {
            //   id: 'yusdcv2',
            //   address: '0xd6aD7a6750A7593E092a9B218d66C0A814a3436e',
            //   symbol: 'yUSDC',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 6
            // },
            // {
            //   id: 'yusdtv2',
            //   address: '0x83f798e925BcD4017Eb265844FDDAbb448f1707D',
            //   symbol: 'yUSDT',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 6
            // },
            // {
            //   id: 'ytusdv2',
            //   address: '0x73a052500105205d34Daf004eAb301916DA8190f',
            //   symbol: 'yTUSd',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 18
            // },
            // {
            //   id: 'yusdv2',
            //   address: '0xF61718057901F84C4eEC4339EF8f0D86D2B45600',
            //   symbol: 'ySUSD',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 18
            // },
            // {
            //   id: 'ywbtcv2',
            //   address: '0x04Aa51bbcB46541455cCF1B8bef2ebc5d3787EC9',
            //   symbol: 'yWBTC',
            //   abi: config.IEarnErc20ABIv2,
            //   decimals: 8
            // },
            // {
            //   id: 'ydaiv1',
            //   address: '0x9D25057e62939D3408406975aD75Ffe834DA4cDd',
            //   symbol: 'yDAI',
            //   abi: config.IEarnERC20ABI,
            //   decimals: 18
            // },
            // {
            //   id: 'yusdcv1',
            //   address: '0xa2609B2b43AC0F5EbE27deB944d2a399C201E3dA',
            //   symbol: 'yUSDC',
            //   abi: config.IEarnERC20ABI,
            //   decimals: 6
            // },
            // {
            //   id: 'yusdtv1',
            //   address: '0xa1787206d5b1bE0f432C4c4f96Dc4D1257A1Dd14',
            //   symbol: 'yUSDT',
            //   abi: config.IEarnERC20ABI,
            //   decimals: 6
            // },
            // {
            //   id: 'ysusdv1',
            //   address: '0x36324b8168f960A12a8fD01406C9C78143d41380',
            //   symbol: 'ySUSD',
            //   abi: config.IEarnERC20ABI,
            //   decimals: 18
            // },
            // {
            //   id: 'ybtcv1',
            //   address: '0x04EF8121aD039ff41d10029c91EA1694432514e9',
            //   symbol: 'yBTC',
            //   abi: config.IEarnERC20ABI,
            //   decimals: 8,
            // },
            // {
            //   id: 'ycrvv1',
            //   address: '0x9Ce551A9D2B1A4Ec0cc6eB0E0CC12977F6ED306C',
            //   symbol: 'yCRV',
            //   abi: config.IEarnERC20ABI,
            //   decimals: 18
            // },
            // {
            //   id: 'iethv1',
            //   address: '0x9Dde7cdd09dbed542fC422d18d89A589fA9fD4C0',
            //   symbol: 'iETH',
            //   abi: config.IEarnABI,
            //   decimals: 18
            // }
          ]
        },
        {
          id: 'yswap',
          name: 'yswap.finance',
          website: 'https://yswap.finance',
          tokens: [
            // {
            //   id: 'aunidai',
            //   address: '0x048930eec73c91B44b0844aEACdEBADC2F2b6efb',
            //   symbol: 'aUniDAI',
            //   abi: config.erc20ABI,
            //   fyiAddress: config.yCurveFiRewardsAddress,
            //   fyiABI: config.yCurveFiRewardsABI,
            //   decimals: 18,
            //   balance: 0,
            //   stakedBalance: 0,
            //   rewardsAvailable: 0
            // }
          ]
        },
        {
          id: 'ytrade',
          name: 'ytrade.finance',
          website: 'https://ytrade.finance',
          tokens: [

          ]
        },
        {
          id: 'iliquidate',
          name: 'iliquidate.finance',
          website: 'https://iliquidate.finance',
          tokens: [

          ]
        },
        {
          id: 'ileverage',
          name: 'ileverage.finance',
          website: 'https://ileverage.finance',
          tokens: [

          ]
        },
        {
          id: 'ipool',
          name: 'ipool.finance',
          website: 'https://ipool.finance',
          tokens: [

          ]
        }
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
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  configure = () => {
    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED)
    }, 100)
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

          console.log(data)

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]

          console.log(token)

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        console.log(tokensData)
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

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
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

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
        .on('transactionHash', function(hash){
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
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.yCurveFiRewardsABI, config.yCurveFiRewardsAddress)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.yCurveFiRewardsABI, config.yCurveFiRewardsAddress)

    try {
      var rewards = await erc20Contract.methods.rewards(account.address).call({ from: account.address });
      rewards = parseFloat(rewards)/10**asset.decimals
      callback(null, parseFloat(rewards))
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
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
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
          .on('transactionHash', function(hash){
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

    this._checkApproval(asset, account, amount, asset.fyiAddress, (err) => {
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

  _callStake = (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.fyiABI, asset.fyiAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.stake(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
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

  _callWithdraw = (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.fyiABI, asset.fyiAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals != 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.withdraw(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
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

  _callGetReward = (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.fyiABI, asset.fyiAddress)

    yCurveFiContract.methods.getReward().send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
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

  _callExit = (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.fyiABI, asset.fyiAddress)

    yCurveFiContract.methods.exit().send({ from: account.address, gasPrice: web3.utils.toWei(store.getStore('universalGasPrice'), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber == 2) {
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
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
