const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(
  'demand tower churn cave nerve amount nasty scare luxury seed salt table',
  'https://rinkeby.infura.io/MPuno8kDWrMBVLZPcRHN'
);

const web3 = new Web3(provider);

module.exports = web3;
