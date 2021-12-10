require('dotenv').config();
const abis = require('../abis');
const { mainnet: addresses } = require('../addresses');
const { web3, connection } = require('../config');
const BigNumber = require('bignumber.js');

const mdexRouter = new web3.eth.Contract(
    abis.mdex.router,
    addresses.mdex.router
);
class Mdex {
    async insertToDB(resultAddressOne, resultAddressTwo, pair_dex_id){
        const amounts1 = await mdexRouter.methods.getAmountsOut(100000, [resultAddressTwo[0].address, resultAddressOne[0].address]).call();
        const amounts2 = await mdexRouter.methods.getAmountsOut(100000, [resultAddressOne[0].address, resultAddressTwo[0].address]).call();
        const rates = {
            buy: 1 / (amounts2[1] / 100000),
            sell: amounts1[1] / 100000
        };
        if(process.env.LOGGING){
            console.log(`Mdex ${resultAddressOne[0].coin}/${resultAddressTwo[0].coin}`);
            console.table(rates);
        }
        connection.query(
            'INSERT INTO `prices` (buy_price, sell_price, pair_dex_id) VALUES (' + rates.buy + ", " + rates.sell + ", " + pair_dex_id + ")",
        );
    }

    async displayPrices(result_pairs_dex_one){
        const amounts1 = await mdexRouter.methods.getAmountsOut(100000, [result_pairs_dex_one[0].quote_coin_address, result_pairs_dex_one[0].base_coin_address]).call();
        const amounts2 = await mdexRouter.methods.getAmountsOut(100000, [result_pairs_dex_one[0].base_coin_address, result_pairs_dex_one[0].quote_coin_address]).call();
        const rates = {
            buy: 1 / (amounts2[1] / 100000),
            sell: amounts1[1] / 100000
        };
        if(process.env.LOGGING){
            console.log(`Mdex ${result_pairs_dex_one[0].base_coin_coin}/${result_pairs_dex_one[0].quote_coin_coin}`);
            console.table(rates);
        }
        return rates;
    }
}

module.exports = Mdex;