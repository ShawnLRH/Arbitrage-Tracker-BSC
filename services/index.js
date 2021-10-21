const initExchange = require('../helper');
const Kyber = require('../models/kyber');
const Mdex = require('../models/mdex');
const Pancakeswap = require('../models/pancakeswap');

module.exports.insert_prices_DB = (result_dex, result_address, i) => {
    if(result_dex[0].exchange === "pancakeswap"){
        const pancakeswap = new Pancakeswap();
        pancakeswap.insertPricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "mdex"){
        const mdex = new Mdex();
        mdex.insertPricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "kyber"){
        const kyber = new Kyber();
        kyber.insertPricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else{
        console.log("Please add exchange to codes first.")
    }
}

module.exports.get_prices = async(result_dex, result_address, i) => {
    const exchange = await initExchange(result_dex[0].id);
    const prices = await exchange.displayPrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
}