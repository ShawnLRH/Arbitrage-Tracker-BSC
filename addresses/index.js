const kyberMainnet = require('./kyber-mainnet.json');
const pancakeswapMainnet = require('./pancakeswap-mainnet.json');
const dydxMainnet = require('./dydx-mainnet.json');
const tokensMainnet = require('./tokens-mainnet.json');
const apeswapMainnet = require('./apeswap-mainnet.json');

module.exports = {
  mainnet: {
    kyber: kyberMainnet,
    pancakeswap: pancakeswapMainnet,
    dydx: dydxMainnet,
    tokens: tokensMainnet,
    apeswap: apeswapMainnet
  }
};
