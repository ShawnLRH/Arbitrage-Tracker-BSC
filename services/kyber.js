require('dotenv').config()
const Web3 = require('web3');
const {ChainId: kyberChain, Fetcher: kyberFetcher, Route} = require('@dynamic-amm/sdk');
const {JsonRpcProvider} = require("@ethersproject/providers");
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const mysql = require('mysql2');

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'arbitrage',
    multipleStatements: true
});

const getLatestCoinPrice = async(slug) => {
  const price = await CoinGeckoClient.coins.markets({
      vs_currency: 'usd',
      ids: [slug]
  });
  return price.data[0].current_price;
}

module.exports.kyberDB = async (coin1Address, coin2Address, coin1Name, coin2Name, pair_dex_id) => {
    const [coin1, coin2] = await Promise.all(
      [coin1Address, coin2Address].map(tokenAddress => (
        kyberFetcher.fetchTokenData(
            kyberChain.BSCMAINNET,
            tokenAddress,
            provider
        )
    )));
  
    const pair = await kyberFetcher.fetchPairData(
      coin1,
      coin2,
      "0x878dFE971d44e9122048308301F540910Bbd934c",
      provider
    );
  
    const route = new Route(pair, coin1);
  
    const kyberRatesUsdtBusd = {
        Buy: route.midPrice.invert().toSignificant(6),
        Sell: route.midPrice.toSignificant(6)
    }
  
    console.log(`Kyber ${coin1Name}/${coin2Name}`)
    console.log(kyberRatesUsdtBusd);
    connection.query(
        'INSERT INTO `prices` (buy_price, sell_price, pair_dex_id) VALUES (' + route.midPrice.toSignificant(6) + ", " + route.midPrice.invert().toSignificant(6) + ", " + pair_dex_id + ")",
    ); 
}

module.exports.kyber = async (coin1Address, coin2Address, coin1Name, coin2Name, coin1Slug, coin2Slug) => {

    let RECENT_COIN1_PRICE = await getLatestCoinPrice(coin1Slug);
    let RECENT_COIN2_PRICE = await getLatestCoinPrice(coin2Slug);
    let RECENT_BNB_PRICE = await getLatestCoinPrice('binancecoin')
    const AMOUNT_BNB = 100;
    const AMOUNT_COIN2_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN2_PRICE).toString());
    const AMOUNT_COIN1_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN1_PRICE).toString());

    const [coin1, coin2] = await Promise.all(
        [coin1Address, coin2Address].map(tokenAddress => (
            kyberFetcher.fetchTokenData(
                kyberChain.BSCMAINNET,
                tokenAddress,
                provider
            )
        )));
  
    const pair = await kyberFetcher.fetchPairData(
        coin1,
        coin2,
        "0x878dFE971d44e9122048308301F540910Bbd934c",
        provider
    );
  
    const route = new Route(pair, coin2);
  
    const kyberRatesUsdtBusd = {
        Buy: route.midPrice.invert().toSignificant(6),
        Sell: route.midPrice.toSignificant(6)
    }
    console.log(`Kyber ${coin1Name}/${coin2Name}`)
    console.log(kyberRatesUsdtBusd);
}