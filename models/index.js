// get the client
const { connection } = require('../config');
require('dotenv').config()

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