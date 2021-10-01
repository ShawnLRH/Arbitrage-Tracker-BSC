require('dotenv').config()
const Web3 = require('web3');
const { ChainId, Fetcher, TokenAmount } = require('@mdex/bsc-sdk');
const abis = require('./abis');
const { mainnet: addresses } = require('./addresses');
const {JsonRpcProvider} = require("@ethersproject/providers");
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);

module.exports.mdex = async () => {

    const AMOUNT_BNB = 100;
    let RECENT_BNB_PRICE = 353;
    const AMOUNT_BNB_WEI = web3.utils.toWei(AMOUNT_BNB.toString());
    const AMOUNT_USDT_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE).toString());

  const [wbnb, usdt] = await Promise.all(
    [addresses.tokens.wbnb, addresses.tokens.usdt].map(tokenAddress => (
      Fetcher.fetchTokenData(
        ChainId.BSCMAINNET,
        tokenAddress,
        provider
      )
  )));

  const wbnbusdt = await Fetcher.fetchPairData(
    wbnb,
    usdt,
    provider
  );

        const price = await CoinGeckoClient.coins.markets({
            vs_currency: 'usd',
            ids: ['binancecoin']
          });
          RECENT_BNB_PRICE = price.data[0].current_price;
    
          const mdexResults = await Promise.all([
            wbnbusdt.getOutputAmount(new TokenAmount(usdt, AMOUNT_USDT_WEI)),
            wbnbusdt.getOutputAmount(new TokenAmount(wbnb, AMOUNT_BNB_WEI))
          ]);
          const mdexRates = {
            buy: parseFloat( AMOUNT_USDT_WEI / (mdexResults[0][0].toExact() * 10 ** 18)),
            sell: parseFloat(mdexResults[1][0].toExact() / AMOUNT_BNB),
          };
          console.log('Mdex BNB/USDT');
          console.log(mdexRates); 
}