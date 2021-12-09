require('dotenv').config();
const abis = require('../abis');
const { mainnet: addresses } = require('../addresses');
const { web3, connection } = require('../config');
const BigNumber = require('bignumber.js');

const pancakeRouter = new web3.eth.Contract(
    abis.pancakeSwap.router,
    addresses.pancakeSwap.router
);
class Pancakeswap {
    async insertToDB(resultAddressOne, resultAddressTwo, pair_dex_id){
        const amounts1 = await pancakeRouter.methods.getAmountsOut(100000, [resultAddressTwo[0].quote_coin_address, resultAddressOne[0].base_coin_address]).call();
        const amounts2 = await pancakeRouter.methods.getAmountsOut(100000, [resultAddressOne[0].base_coin_address, resultAddressTwo[0].quote_coin_address]).call();
        const rates = {
            buy: 1 / (amounts2[1] / 100000),
            sell: amounts1[1] / 100000
        };
        if(process.env.logging_enabled){
            console.log(`Pancakeswap ${resultAddressOne[0].coin}/${resultAddressTwo[0].coin}`);
            console.table(rates);
        }
        connection.query(
            'INSERT INTO `prices` (buy_price, sell_price, pair_dex_id) VALUES (' + rates.buy + ", " + rates.sell + ", " + pair_dex_id + ")",
        );
    }

    async displayPrices(result_pairs_dex_one){
        const amounts1 = await pancakeRouter.methods.getAmountsOut(100000, [result_pairs_dex_one[0].quote_coin_address, result_pairs_dex_one[0].base_coin_address]).call();
        const amounts2 = await pancakeRouter.methods.getAmountsOut(100000, [result_pairs_dex_one[0].base_coin_address, result_pairs_dex_one[0].quote_coin_address]).call();
        const rates = {
            buy: 1 / (amounts2[1] / 100000),
            sell: amounts1[1] / 100000
        };
        if(process.env.logging_enabled){
            console.log(`Pancakeswap ${result_pairs_dex_one[0].base_coin_coin}/${result_pairs_dex_one[0].quote_coin_coin}`);
            console.table(rates);
        }
        return rates;
    }
}

module.exports = Pancakeswap;