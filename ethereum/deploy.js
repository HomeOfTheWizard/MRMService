const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledMRM = require('./build/MRManager.json');

const provider = new HDWalletProvider(
  'demand tower churn cave nerve amount nasty scare luxury seed salt table',
  'https://rinkeby.infura.io/MPuno8kDWrMBVLZPcRHN'
);

const web3 = new Web3(provider);

const deploy = async ()=>{
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledMRM.interface))
    .deploy({ data: '0x'+ compiledMRM.bytecode,
      arguments: ['20','10', accounts[0], accounts.slice(0, 1) ]
    })
    .send({ gas: '1500000', gasPrice: web3.utils.toWei('2','gwei'), from: accounts[0] });

  console.log('Constract deployed to', result.options.address);
};
deploy();
