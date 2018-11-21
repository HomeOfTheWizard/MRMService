const web3 = require('./web3');
const MRManager = require('./build/MRManager.json');

const instance = new web3.eth.Contract(
  JSON.parse(MRManager.interface),
  '0xBb8E967BdC02e7789d3AF15024d059973A30663E'
);

module.exports = instance;
