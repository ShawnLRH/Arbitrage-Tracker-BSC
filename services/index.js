const { insert_to_DB : insertKyberDB, displayPrices : kyberPrices } = require('../models/kyber');
const { insert_to_DB : insertMdexPricesDB, displayPrices : mdexPrices } = require('../models/mdex');
const { insert_to_DB : insertPancakePricesDB , displayPrices : pancakePrices } = require('../models/pancakeswap');

module.exports.insert_prices_DB = (result_dex, result_address, i) => {
    if(result_dex[0].exchange === "pancakeswap"){
            insertPancakePricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "mdex"){
            insertMdexPricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "kyber"){
            insertKyberDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else{
        console.log("Please add exchange to codes first.")
    }
}

module.exports.get_prices = (result_dex, result_address, i) => {
    if(result_dex[0].exchange === "pancakeswap"){
            pancakePrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "mdex"){
            mdexPrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "kyber"){
            kyberPrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else{
        console.log("Please add exchange to codes first.")
    }
}