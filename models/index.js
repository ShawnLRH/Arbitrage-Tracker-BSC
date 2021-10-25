// get the client
const { connection } = require('../config');
require('dotenv').config()


module.exports.pairAndDexDataOne = (result, i) =>{
    return new Promise((resolve, reject)=>{
        connection.query(
            'SELECT view_innerjoin_coins_base.id, view_innerjoin_coins_base.quote_coin_id, view_innerjoin_coins_base.exchange, view_innerjoin_coins_base.coin AS base_coin_coin, view_innerjoin_coins_base.slug AS base_coin_slug, view_innerjoin_coins_base.address AS base_coin_address, coins.coin AS quote_coin_coin, coins.slug AS quote_coin_slug, coins.address AS quote_coin_address FROM `view_innerjoin_coins_base` INNER JOIN coins ON view_innerjoin_coins_base.quote_coin_id = coins.id WHERE view_innerjoin_coins_base.id = ' + result[i].pair_dex_one,
            function(err, results, fields) {
                return resolve(results);
            }
        );
    })
}

module.exports.pairAndDexDataTwo = (result, i) =>{
    console.log(result[i].dex_id);
    return new Promise((resolve, reject)=>{
        connection.query(
            'SELECT view_innerjoin_coins_base.id, view_innerjoin_coins_base.quote_coin_id, view_innerjoin_coins_base.exchange, view_innerjoin_coins_base.coin AS base_coin_coin, view_innerjoin_coins_base.slug AS base_coin_slug, view_innerjoin_coins_base.address AS base_coin_address, coins.coin AS quote_coin_coin, coins.slug AS quote_coin_slug, coins.address AS quote_coin_address FROM `view_innerjoin_coins_base` INNER JOIN coins ON view_innerjoin_coins_base.quote_coin_id = coins.id WHERE view_innerjoin_coins_base.id = ' + result[i].pair_dex_two,
            function(err, results, fields) {
                return resolve(results);
            }
        );
    })
}

module.exports.get_pair_to_dex = () =>{
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `pair_to_dex`',
            function(err, results, fields) {
                return resolve(results);
            }
        );
    })
}
module.exports.get_compare_mapping = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `compare_mapping`',
            function(err, results, fields) {
                return resolve(results);
            }
        )
    })
}
module.exports.get_dex = (result, i) => {
    return new Promise((resolve, reject)=>{
        connection.query(
            'SELECT * FROM `dex` WHERE `id` = ' + result[i].dex_id,
            function(err, results,fields) {
                return resolve(results);
            }
        )
    })
}
module.exports.get_pairs = (result, i) => {
    return new Promise((resolve, reject)=> {
        connection.query(
            'SELECT * FROM `pairs` WHERE' +  '`id` = ' + result[i].pair_id,
            function(err, results, fields) {
                return resolve(results);
            }
        );
    })
}
module.exports.get_pairs_dex_compare = (result, i) => {
    return new Promise((resolve, reject)=> {
        connection.query(
            'SELECT * FROM `pair_to_dex` WHERE' +  '`id` = ' + result[i].pair_dex_one + ';' + 'SELECT * FROM `pair_to_dex` WHERE `id` = ' + result[i].pair_dex_two,
            function(err, results, fields) {
                if (err) {
                    throw error;
                }
                return resolve(results);
            }
        );
    })
}
module.exports.get_address = (result) =>{
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM `coins` WHERE' +  '`id` = ' + result[0].quote_coin_id + ';' + 'SELECT * FROM `coins` WHERE' +  '`id` = ' + result[0].base_coin_id, [2, 1], 
        function(error, results, fields) {
            if (error) {
                throw error;
            }
            return resolve(results);
        });
    })
}

module.exports.get_pairs_compare = (result, i) => {
    return new Promise((resolve, reject)=> {
        connection.query(
            'SELECT * FROM `pairs` WHERE' +  '`id` = ' + result[i][0].pair_id,
            function(err, results, fields) {
                return resolve(results);
            }
        );
    })
}

module.exports.get_dex_compare = (result, i) => {
    return new Promise((resolve, reject)=>{
        connection.query(
            'SELECT * FROM `dex` WHERE `id` = ' + result[i][0].dex_id,
            function(err, results,fields) {
                return resolve(results);
            }
        )
    })
}