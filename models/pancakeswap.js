require('dotenv').config()
const { ChainId, Fetcher, TokenAmount} = require('@pancakeswap/sdk');
const { connection, web3, provider } = require('../config');
const { getLatestCoinPrice } = require('../libraries');

module.exports.insert_to_DB = async(coin1Address, coin2Address, coin1Name, coin2Name, coin1Slug, coin2Slug, pair_dex_id) => {
    let RECENT_COIN1_PRICE = await getLatestCoinPrice(coin1Slug);
    let RECENT_COIN2_PRICE = await getLatestCoinPrice(coin2Slug);
    let RECENT_BNB_PRICE = await getLatestCoinPrice('binancecoin')
    const AMOUNT_BNB = 100;
    const AMOUNT_COIN2 = AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN2_PRICE;
    const AMOUNT_COIN1_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN1_PRICE).toString());
    const AMOUNT_COIN2_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN2_PRICE).toString());
        
    const [coin1, coin2] = await Promise.all(
        [coin1Address, coin2Address].map(tokenAddress => (
            Fetcher.fetchTokenData(
                ChainId.MAINNET,
                tokenAddress,
                provider
            )
        )));
            
    const pair = await Fetcher.fetchPairData(
        coin1,
        coin2,
        provider
    );

    const pancakeswapResults = await Promise.all([
        pair.getOutputAmount(new TokenAmount(coin1, AMOUNT_COIN1_WEI)),
        pair.getOutputAmount(new TokenAmount(coin2, AMOUNT_COIN2_WEI))
    ]);

    const pancakeswapRates = {
        buy: parseFloat( AMOUNT_COIN1_WEI / (pancakeswapResults[0][0].toExact() * 10 ** 18)),
        sell: parseFloat(pancakeswapResults[1][0].toExact() / AMOUNT_COIN2),
    };
    console.log(`Pancakeswap ${coin1Name}/${coin2Name} `);
    console.log(pancakeswapRates); 
    connection.query(
        'INSERT INTO `prices` (buy_price, sell_price, pair_dex_id) VALUES (' + parseFloat( AMOUNT_COIN1_WEI / (pancakeswapResults[0][0].toExact() * 10 ** 18)) + ", " + parseFloat(pancakeswapResults[1][0].toExact() / AMOUNT_COIN2) + ", " + pair_dex_id + ")",
    ); 
}

module.exports.displayPrices = async(coin1Address, coin2Address, coin1Name, coin2Name, coin1Slug, coin2Slug) => {
    let RECENT_COIN1_PRICE = await getLatestCoinPrice(coin1Slug);
    let RECENT_COIN2_PRICE = await getLatestCoinPrice(coin2Slug);
    let RECENT_BNB_PRICE = await getLatestCoinPrice('binancecoin')
    const AMOUNT_BNB = 100;
    const AMOUNT_COIN2 = AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN2_PRICE;
    const AMOUNT_COIN1_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN1_PRICE).toString());
    const AMOUNT_COIN2_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE / RECENT_COIN2_PRICE).toString());
        
    const [coin1, coin2] = await Promise.all(
        [coin1Address, coin2Address].map(tokenAddress => (
            Fetcher.fetchTokenData(
                ChainId.MAINNET,
                tokenAddress,
                provider
            )
        )));
            
    const pair = await Fetcher.fetchPairData(
        coin1,
        coin2,
        provider
    );

    const pancakeswapResults = await Promise.all([
        pair.getOutputAmount(new TokenAmount(coin1, AMOUNT_COIN1_WEI)),
        pair.getOutputAmount(new TokenAmount(coin2, AMOUNT_COIN2_WEI))
    ]);

    const pancakeswapRates = {
        buy: parseFloat( AMOUNT_COIN1_WEI / (pancakeswapResults[0][0].toExact() * 10 ** 18)),
        sell: parseFloat(pancakeswapResults[1][0].toExact() / AMOUNT_COIN2),
    };
    console.log(`Pancakeswap ${coin1Name}/${coin2Name} `);
    console.log(pancakeswapRates); 
}