require('dotenv').config()
const { web3, connection } = require('../config');
const initExchange = require('../helper');
const { getLatestCoinPrice } = require('../libraries');

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

//Initiate exchange class and feed it with database data to push data to the sql table
module.exports.insert_prices_DB = async(result_dex, result_address, i) => {
    const exchange = await initExchange(result_dex[0].id);
    console.log(result_address[0].address);
    console.log(result_address[1]);
    await exchange.insertToDB(result_address[0], result_address[1], i)
}

//Initiate exchange class and feed it with database data to get price display
module.exports.get_prices = async(result_dex, result_address, i) => {
    const exchange = await initExchange(result_dex[0].id);
    await exchange.displayPrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
}

//Price comparison for arbitrage calculations
module.exports.comparePrices = async(result_pairs_dex_one, result_pairs_dex_two, i) => {
    const exchange1 = await initExchange(result_pairs_dex_one[0].dex_id);
    const exchange2 = await initExchange(result_pairs_dex_two[0].dex_id);
    const prices1 = await exchange1.displayPrices(result_pairs_dex_one);
    const prices2 = await exchange2.displayPrices(result_pairs_dex_two);
    const AMOUNT_BNB_WEI = web3.utils.toWei("100");
    const gasPrice = await web3.eth.getGasPrice();
    //200000 is picked arbitrarily, have to be replaced by actual tx cost, with Web3 estimateGas()
    const txCost = 200000 * parseInt(gasPrice);
    const currentBnbPrice = (prices1.buy + prices1.sell) / 2; 
    const profit1 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices1.sell - prices2.buy) - (txCost / 10 ** 18) * currentBnbPrice;
    const profit2 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices2.sell - prices1.buy) - (txCost / 10 ** 18) * currentBnbPrice;
    if(profit1 > 0) {
        if(process.env.LOGGING){
            console.log('Arbitrage opportunity found!');
            console.log(`Buy ${result_pairs_dex_one[0].base_coin_coin} on ${result_pairs_dex_two[0].exchange} at ${prices2.buy} USD`);
            console.log(`Sell ${result_pairs_dex_one[0].base_coin_coin} on ${result_pairs_dex_one[0].exchange} at ${prices1.sell} USD`);
            console.log(`Expected profit: ${profit1} USD`);
        }
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_two[0].exchange + '", "' + result_pairs_dex_one[0].exchange + '", ' + profit1.toFixed(3) +', "profit")',
        );
        await bot.sendMessage('-474954526', 'Arbitrage Opportunity Found!')
        await bot.sendMessage('-474954526', `Buy ${result_pairs_dex_one[0].base_coin_coin} with ${result_pairs_dex_one[0].base_coin_coin}/${result_pairs_dex_one[0].quote_coin_coin} pair from ${result_pairs_dex_two[0].exchange} at ${prices2.buy} USD and Sell ${result_pairs_dex_one[0].base_coin_coin} with ${result_pairs_dex_one[0].base_coin_coin}/${result_pairs_dex_one[0].quote_coin_coin} pair from ${result_pairs_dex_one[0].exchange} at ${prices1.sell} USD`);
    } else if(profit2 > 0) {
        if(process.env.LOGGING){
            console.log('Arbitrage opportunity found!');
            console.log(`Buy ${result_pairs_dex_one[0].base_coin_coin} from ${result_pairs_dex_one[0].exchange} at ${prices1.buy} USD`);
            console.log(`Sell ${result_pairs_dex_one[0].base_coin_coin} from ${result_pairs_dex_two[0].exchange} at ${prices2.sell} USD`);
            console.log(`Expected profit: ${profit2} USD`);
        }
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_one[0].exchange + '", "' + result_pairs_dex_two[0].exchange + '", ' + profit2.toFixed(3) +', "profit")',
        );
        await bot.sendMessage('-474954526', 'Arbitrage Opportunity Found!')
        await bot.sendMessage('-474954526', `Buy ${result_pairs_dex_one[0].base_coin_coin} with ${result_pairs_dex_one[0].base_coin_coin}/${result_pairs_dex_one[0].quote_coin_coin} pair from ${result_pairs_dex_one[0].exchange} at ${prices1.buy} USD and Sell ${result_pairs_dex_one[0].base_coin_coin} with ${result_pairs_dex_one[0].base_coin_coin}/${result_pairs_dex_one[0].quote_coin_coin} pair from ${result_pairs_dex_two[0].exchange} at ${prices2.sell} USD`);
        //Execute arb Uniswap <=> Kyber
    }else{
        if(process.env.LOGGING){
            console.log('No Arbitrage opportunity found!');
        }
        let buy1 = await ["buy", result_pairs_dex_one[0].base_coin_coin, result_pairs_dex_two[0].exchange, prices2.buy];
        let sell1 = await ["sell", result_pairs_dex_one[0].base_coin_coin, result_pairs_dex_one[0].exchange, prices1.sell];
        let total1 = [buy1, sell1];
        if(process.env.LOGGING){
            await console.table(total1);
            console.log(`Expected loss: ${Math.abs(profit1)} USD`);
        }
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_two[0].exchange + '", "' + result_pairs_dex_one[0].exchange + '", ' + profit1.toFixed(3) +', "loss")',
        ); 
        let buy2 = await["buy", result_pairs_dex_one[0].base_coin_coin, result_pairs_dex_one[0].exchange, prices1.buy];
        let sell2 = await["sell", result_pairs_dex_one[0].base_coin_coin, result_pairs_dex_two[0].exchange, prices2.sell];
        let total2 = [buy2, sell2];
        if(process.env.LOGGING){
            await console.table(total2);
            console.log(`Expected loss: ${Math.abs(profit2)} USD`);
        }
        connection.query(
            'INSERT INTO `compare_prices` (compare_id, buy_exchange, sell_exchange, difference, profit_loss) VALUES (' + i + ', "' + result_pairs_dex_one[0].exchange + '", "' + result_pairs_dex_two[0].exchange + '", ' + profit2.toFixed(3) +', "loss")',
        );
    }
}