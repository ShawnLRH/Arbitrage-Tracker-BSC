const kyberMainnet = require('./kyber-mainnet.json');
const pancakeswapMainnet = require('./pancakeswap-mainnet.json');
const dydxMainnet = require('./dydx-mainnet.json');
const tokensMainnet = require('./tokens-mainnet.json');
const apeswapMainnet = require('./apeswap-mainnet.json');
const bakerySwap = require('./bakerySwap-mainnet.json');
const mdex = require('./mdex-mainnet.json');
const sushiswap = require('./sushiswap-mainnet.json');

module.exports = {
  mainnet: {
    kyber: kyberMainnet,
    pancakeSwap: pancakeswapMainnet,
    dydx: dydxMainnet,
    tokens: tokensMainnet,
    apeswap: apeswapMainnet,
    bakerySwap: bakerySwap,
    mdex: mdex,
    sushiswap: sushiswap
  }
};
