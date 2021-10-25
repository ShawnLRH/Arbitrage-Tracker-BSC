const { web3, connection } = require('../config');
const initExchange = require('../helper');
const { getLatestCoinPrice } = require('../libraries');
const Kyber = require('../models/kyber');
const Mdex = require('../models/mdex');
const Pancakeswap = require('../models/pancakeswap');


module.exports.insert_prices_DB = async(result_dex, result_address, i) => {
    const exchange = await initExchange(result_dex[0].id);
    await exchange.insertToDB(result_address[0], result_address[1], i)
}

module.exports.get_prices = async(result_dex, result_address, i) => {
    const exchange = await initExchange(result_dex[0].id);
    await exchange.displayPrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
}

module.exports.comparePrices = async(result_pairs_dex_one, result_pairs_dex_two, i) => {
    console.log("checking");
    const exchange1 = await initExchange(result_pairs_dex_one[0].dex_id);
    const exchange2 = await initExchange(result_pairs_dex_two[0].dex_id);
    const prices1 = await exchange1.displayPrices(result_pairs_dex_one);
    const prices2 = await exchange2.displayPrices(result_pairs_dex_two);
    const AMOUNT_BNB_WEI = web3.utils.toWei("100");
    const gasPrice = await web3.eth.getGasPrice();
    //200000 is picked arbitrarily, have to be replaced by actual tx cost in next lectures, with Web3 estimateGas()
    const txCost = 200000 * parseInt(gasPrice);
    const currentBnbPrice = (prices1.buy + prices1.sell) / 2; 
    const profit1 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices1.sell - prices2.buy) - (txCost / 10 ** 18) * currentBnbPrice;
    const profit2 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices2.sell - prices1.buy) - (txCost / 10 ** 18) * currentBnbPrice;
    if(profit1 > 0) {
        console.log('Arbitrage opportunity found!');
        console.log(`Buy ${result_pairs_dex_one[0].base_coin_coin} on ${result_pairs_dex_two[0].exchange} at ${prices2.buy} USD`);
        console.log(`Sell ${result_pairs_dex_one[0].base_coin_coin} on ${result_pairs_dex_one[0].exchange} at ${prices1.sell} USD`);
        console.log(`Expected profit: ${profit1} USD`);
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_two[0].exchange + '", "' + result_pairs_dex_one[0].exchange + '", ' + profit1 +', "profit")',
        ); 
        //Execute arb Kyber <=> Uniswap
    } else if(profit2 > 0) {
        console.log('Arbitrage opportunity found!');
        console.log(`Buy ${result_pairs_dex_one[0].base_coin_coin} from ${result_pairs_dex_one[0].exchange} at ${prices1.buy} USD`);
        console.log(`Sell ${result_pairs_dex_one[0].base_coin_coin} from ${result_pairs_dex_two[0].exchange} at ${prices2.sell} USD`);
        console.log(`Expected profit: ${profit2} USD`);
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_one[0].exchange + '", "' + result_pairs_dex_two[0].exchange + '", ' + profit2 +', "profit")',
        ); 
        //Execute arb Uniswap <=> Kyber
    }else{
        console.log('No Arbitrage opportunity found!');
        console.log(`Buy ${result_pairs_dex_one[0].base_coin_coin} on ${result_pairs_dex_two[0].exchange} at ${prices2.buy} USD`);
        console.log(`Sell ${result_pairs_dex_one[0].base_coin_coin} on ${result_pairs_dex_one[0].exchange} at ${prices1.sell} USD`);
        console.log(`Expected loss: ${Math.abs(profit1)} USD`);
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_two[0].exchange + '", "' + result_pairs_dex_one[0].exchange + '", ' + profit1 +', "loss")',
        ); 
        console.log(`Buy ${result_pairs_dex_one[0].base_coin_coin} from ${result_pairs_dex_one[0].exchange} at ${prices1.buy} USD`);
        console.log(`Sell ${result_pairs_dex_one[0].base_coin_coin} from ${result_pairs_dex_two[0].exchange} at ${prices2.sell} USD`);
        console.log(`Expected loss: ${Math.abs(profit2)} USD`);
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_one[0].exchange + '", "' + result_pairs_dex_two[0].exchange + '", ' + profit2 +', "loss")',
        ); 
    }
}