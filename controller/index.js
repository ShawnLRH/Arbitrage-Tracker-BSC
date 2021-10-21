const { get_pair_to_dex, get_dex, get_pairs, get_address, get_compare_mapping, get_pairs_dex_compare, get_pairs_compare, get_dex_compare } = require('../models');
const { insert_prices_DB, get_prices, comparePrices } = require('../services');

// get the client
require('dotenv').config()

module.exports.insert_database_method = async(req, res) => {
    try{
        const result_info = await get_pair_to_dex()
        for(let i = 0; i < result_info.length; i++){
            const result_dex = await get_dex(result_info, i);
            const result_pairs = await get_pairs(result_info, i);
            const result_address = await get_address(result_pairs);
            await insert_prices_DB(result_dex, result_address, i+1);
        }
    }catch(e){
    }
}

module.exports.retrieve_price_method = async(req, res) => {
    try{
        const result_info = await get_pair_to_dex()
    for(let i = 0; i < result_info.length; i++){
        const result_dex = await get_dex(result_info, i);
        const result_pairs = await get_pairs(result_info, i);
        const result_address = await get_address(result_pairs);
        await get_prices(result_dex, result_address, i+1);
    }
    }catch(e){

    }
}

module.exports.comparePriceMethod = async(req, res) => {
    const result_compare = await get_compare_mapping();
    for(let i = 0; i < result_compare.length; i++){
        const result_pairs_dex = await get_pairs_dex_compare(result_compare, i);
        const result_dex = await get_dex_compare(result_pairs_dex, i)
        const result_dex2 = await get_dex_compare(result_pairs_dex, i+1)
        const result_pairs = await get_pairs_compare(result_pairs_dex, i);
        const result_pairs2 = await get_pairs_compare(result_pairs_dex, i+1);
        const result_address = await get_address(result_pairs);
        const result_address2 = await get_address(result_pairs2);
        await comparePrices(result_pairs_dex, result_address, result_address2, result_dex, result_dex2, i+1);
    }
}