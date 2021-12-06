const {ChainId: kyberChain, Fetcher: kyberFetcher, Route, Trade, TokenAmount, TradeType} = require('@dynamic-amm/sdk');
const { web3, provider, connection } = require('../config');
const { getLatestCoinPrice } = require('../libraries');
const abis = require('../abis');
const { mainnet: addresses } = require('../addresses');

const kyberRouter = new web3.eth.Contract(
    abis.kyber.kyberNetworkProxy,
    addresses.kyber.router
);

class Kyber {
    async insertToDB(resultAddressOne, resultAddressTwo, pair_dex_id){
        const [coin1, coin2] = await Promise.all(
            [resultAddressOne[0].address, resultAddressTwo[0].address].map(tokenAddress => (
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
        
          const amounts1 = await kyberRouter.methods.getAmountsOut(1000000, [pair[1].address], [resultAddressOne[0].address, resultAddressTwo[0].address]).call();
          const amounts2 = await kyberRouter.methods.getAmountsOut(1000000, [pair[1].address], [resultAddressTwo[0].address, resultAddressOne[0].address]).call();
          const rates = {
              buy: 1 / (amounts2[1] / 1000000),
              sell: amounts1[1] / 1000000
          };
        
          console.log(`Kyber ${resultAddressOne[0].coin}/${resultAddressTwo[0].coin}`)
          console.table(rates);
          connection.query(
              'INSERT INTO `prices` (buy_price, sell_price, pair_dex_id) VALUES (' + rates.buy + ", " + rates.sell + ", " + pair_dex_id + ")",
          ); 
    }

    async displayPrices(result_pairs_dex_one){

        let RECENT_COIN1_PRICE = await getLatestCoinPrice(result_pairs_dex_one[0].base_coin_slug);
        let RECENT_COIN2_PRICE = await getLatestCoinPrice(result_pairs_dex_one[0].quote_coin_slug);
        let RECENT_BNB_PRICE = await getLatestCoinPrice('binancecoin')
        const AMOUNT_BNB = 100;
        const AMOUNT_COIN2_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN2_PRICE).toString());
        const AMOUNT_COIN1_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN1_PRICE).toString());

        const [coin1, coin2] = await Promise.all(
            [result_pairs_dex_one[0].base_coin_address, result_pairs_dex_one[0].quote_coin_address].map(tokenAddress => (
                kyberFetcher.fetchTokenData(
                    kyberChain.BSCMAINNET,
                    tokenAddress,
                    provider
                )
            ))
        );
  
        const pair = await kyberFetcher.fetchPairData(
            coin1,
            coin2,
            "0x878dFE971d44e9122048308301F540910Bbd934c",
            provider
        );
  
        const amounts1 = await kyberRouter.methods.getAmountsOut(1000000, [pair[1].address], [result_pairs_dex_one[0].quote_coin_address, result_pairs_dex_one[0].base_coin_address]).call();
        const amounts2 = await kyberRouter.methods.getAmountsOut(1000000, [pair[1].address], [result_pairs_dex_one[0].base_coin_address, result_pairs_dex_one[0].quote_coin_address]).call();
        const rates = {
            buy: 1 / (amounts2[1] / 1000000),
            sell: amounts1[1] / 1000000
        };
        console.log(`Kyber ${result_pairs_dex_one[0].base_coin_coin}/${result_pairs_dex_one[0].quote_coin_coin}`)
        console.table(rates);
        return rates;
    }
}

module.exports = Kyber;