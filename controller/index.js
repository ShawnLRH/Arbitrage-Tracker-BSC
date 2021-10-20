const { get_pair_to_dex, get_dex, get_pairs, get_address } = require('../models');
const { insert_prices_DB, get_prices } = require('../services');

// get the client
require('dotenv').config()

module.exports.mainDB = async(req, res) => {
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

module.exports.main = async(req, res) => {
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