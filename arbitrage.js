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

const AMOUNT_BNB = 100;
let RECENT_BNB_PRICE = 353;
const AMOUNT_BNB_WEI = web3.utils.toWei(AMOUNT_BNB.toString());
const AMOUNT_USDT_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE).toString());

const init = async () => {
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
  
  const [wbnbKyber, usdtKyber] = await Promise.all(
    [addresses.tokens.wbnb, addresses.tokens.usdt].map(tokenAddress => (
      fetcherKyber.fetchTokenData(
        chainIdKyber.BSCMAINNET,
        tokenAddress,
        provider
      )
  )));

  const usdtWbnbKyber = await fetcherKyber.fetchPairData(
    usdtKyber,
    wbnbKyber,
    "0x878dFE971d44e9122048308301F540910Bbd934c",
    provider
  );
  console.log(usdtWbnbKyber);

  web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
      console.log(`New block received. Block # ${block.number}`);

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
      console.log('Pancakeswap BNB/BUSD');
      console.log(pancakeswapRates);

      const route = await new Route(usdtWbnbKyber, usdtKyber);
      console.log(route);
      const kyberRates = {
        buy: parseFloat(AMOUNT_USDT_WEI / (route.midPrice[0] * 10 ** 18)),
        sell: parseFloat(route.midPrice[1] / AMOUNT_BNB),
      };
      console.log('Kyber BNB/USDT');
      console.log(kyberRates);
    })
    .on('error', error => {
      console.log(error);
    });
}
init();