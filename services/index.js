const { web3 } = require('../config');
const initExchange = require('../helper');
const { getLatestCoinPrice } = require('../libraries');
const Kyber = require('../models/kyber');
const Mdex = require('../models/mdex');
const Pancakeswap = require('../models/pancakeswap');

module.exports.insert_prices_DB = async(result_dex, result_address, i) => {
    const exchange = await initExchange(result_dex[0].id);
    await exchange.insertPricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i)
}

module.exports.get_prices = async(result_dex, result_address, i) => {
    const exchange = await initExchange(result_dex[0].id);
    await exchange.displayPrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
}

module.exports.comparePrices = async(result_dex, result_address1, result_address2, exchanges1, exchanges2, i) => {
    console.log("checking");
    const exchange1 = await initExchange(result_dex[0][0].dex_id);
    const exchange2 = await initExchange(result_dex[1][0].dex_id);
    const prices1 = await exchange1.displayPrices(result_address1[0][0].address, result_address1[1][0].address, result_address1[0][0].coin, result_address1[1][0].coin, result_address1[0][0].slug, result_address1[1][0].slug, i);
    const prices2 = await exchange2.displayPrices(result_address2[0][0].address, result_address2[1][0].address, result_address2[0][0].coin, result_address2[1][0].coin, result_address2[0][0].slug, result_address2[1][0].slug, i);
    const AMOUNT_BNB_WEI = web3.utils.toWei("100");
    const gasPrice = await web3.eth.getGasPrice();
    //200000 is picked arbitrarily, have to be replaced by actual tx cost in next lectures, with Web3 estimateGas()
    const txCost = 200000 * parseInt(gasPrice);
    const currentBnbPrice = (prices1.buy + prices1.sell) / 2; 
    const profit1 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices1.sell - prices2.buy) - (txCost / 10 ** 18) * currentBnbPrice;
    const profit2 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices2.sell - prices1.buy) - (txCost / 10 ** 18) * currentBnbPrice;
    if(profit1 > 0) {
        console.log('Arbitrage opportunity found!');
        console.log(`Buy ${result_address1[1][0].coin} on ${exchanges2[0].exchange} at ${prices2.buy} USD`);
        console.log(`Sell ${result_address1[1][0].coin} on ${exchanges1[0].exchange} at ${prices1.sell} USD`);
        console.log(`Expected profit: ${profit1} USD`);
        //Execute arb Kyber <=> Uniswap
    } else if(profit2 > 0) {
        console.log('Arbitrage opportunity found!');
        console.log(`Buy ${result_address1[1][0].coin} from ${exchanges1[0].exchange} at ${prices1.buy} USD`);
        console.log(`Sell ${result_address1[1][0].coin} from ${exchanges2[0].exchange} at ${prices2.sell} USD`);
        console.log(`Expected profit: ${profit2} USD`);
        //Execute arb Uniswap <=> Kyber
    }
}