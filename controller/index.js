const { get_pair_to_dex, get_dex, get_pairs, get_address, get_compare_mapping, get_pairs_dex_compare, get_pairs_compare, get_dex_compare,pairAndDexDataOne, pairAndDexDataTwo } = require('../models');
const { insert_prices_DB, get_prices, comparePrices, comparePricesDB } = require('../services');

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

module.exports.comparePriceMethod = async(req, res) => {
    const result_compare = await get_compare_mapping();
    for(let i = 0; i < result_compare.length; i++){
        const result_pairs_dex_one = await pairAndDexDataOne(result_compare, i);
        const result_pairs_dex_two = await pairAndDexDataTwo(result_compare, i);
        await comparePrices(result_pairs_dex_one, result_pairs_dex_two, i+1)
    }
}