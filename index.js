const { pancakeswapPrices } = require("./pancakeswap");
const { mainnet: addresses } = require('./addresses');
const { ChainId, Fetcher, TokenAmount } = require('@pancakeswap/sdk');
const {JsonRpcProvider} = require("@ethersproject/providers");
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');

const pancakeswap = async () => {
    const [wbnb, busd] = await Promise.all(
      [addresses.tokens.wbnb, addresses.tokens.busd].map(tokenAddress => (
        Fetcher.fetchTokenData(
          ChainId.MAINNET,
          tokenAddress,
          provider
        )
    )));
    const busdWbnb = await Fetcher.fetchPairData(
      busd,
      wbnb,
      provider
    );
    pancakeswapPrices(busdWbnb);
    }

pancakeswap();