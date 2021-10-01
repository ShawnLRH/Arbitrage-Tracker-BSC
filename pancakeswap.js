require('dotenv').config()
const Web3 = require('web3');
const { ChainId, Fetcher, TokenAmount} = require('@pancakeswap/sdk');
const { ChainId: chainIdKyber, Fetcher: fetcherKyber, Route } = require('@dynamic-amm/sdk');
const abis = require('./abis');
const { mainnet: addresses } = require('./addresses');
const {JsonRpcProvider} = require("@ethersproject/providers");
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);

module.exports.pancakeswap = async () => {

  const AMOUNT_BNB = 100;
  let RECENT_BNB_PRICE = 353;
  const AMOUNT_BNB_WEI = web3.utils.toWei(AMOUNT_BNB.toString());
  const AMOUNT_USDT_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE).toString());

  const [wbnb, usdt] = await Promise.all(
    [addresses.tokens.wbnb, addresses.tokens.usdt].map(tokenAddress => (
      Fetcher.fetchTokenData(
        ChainId.MAINNET,
        tokenAddress,
        provider
      )
  )));
  const usdtWbnb = await Fetcher.fetchPairData(
    usdt,
    wbnb,
    provider
  );

      const price = await CoinGeckoClient.coins.markets({
        vs_currency: 'usd',
        ids: ['binancecoin']
      });
      RECENT_BNB_PRICE = price.data[0].current_price;

      const pancakeswapResults = await Promise.all([
        usdtWbnb.getOutputAmount(new TokenAmount(usdt, AMOUNT_USDT_WEI)),
        usdtWbnb.getOutputAmount(new TokenAmount(wbnb, AMOUNT_BNB_WEI))
      ]);
      const pancakeswapRates = {
        buy: parseFloat( AMOUNT_USDT_WEI / (pancakeswapResults[0][0].toExact() * 10 ** 18)),
        sell: parseFloat(pancakeswapResults[1][0].toExact() / AMOUNT_BNB),
      };
      console.log('Pancakeswap BNB/USDT');
      console.log(pancakeswapRates);
}