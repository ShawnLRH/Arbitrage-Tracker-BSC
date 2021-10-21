const {ChainId: kyberChain, Fetcher: kyberFetcher, Route, Trade, TokenAmount, TradeType} = require('@dynamic-amm/sdk');
const { web3, provider, connection } = require('../config');
const { getLatestCoinPrice } = require('../libraries');

class Kyber {
    async insertToDB(coin1Address, coin2Address, coin1Name, coin2Name, coin1Slug, coin2Slug, pair_dex_id){
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

    async displayPrices(coin1Address, coin2Address, coin1Name, coin2Name, coin1Slug, coin2Slug){

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
  
  
    const kyberRates= {
        Buy: route.midPrice.invert().toSignificant(6),
        Sell: route.midPrice.toSignificant(6)
    }
    console.log(`Kyber ${coin1Name}/${coin2Name}`)
    console.log(kyberRates);
    return kyberRates;
    }
}

module.exports = Kyber;