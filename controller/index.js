// get the client
const mysql = require('mysql2');
const { kyberDB, kyber } = require('../services/kyber');
const { mdexPricesDB, mdexPrices } = require('../services/mdex');
const { pancakePricesDB, pancakePrices } = require('../services/pancakeswap');
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'arbitrage',
    multipleStatements: true
  });

const get_info = () =>{
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM `pair_to_dex`',
            function(err, results, fields) {
                return resolve(results);
            }
        );
    })
}
const get_dex = (result, i) => {
    return new Promise((resolve, reject)=>{
        connection.query(
            'SELECT * FROM `dex` WHERE `id` = ' + result[i].dex_id,
            function(err, results,fields) {
                return resolve(results);
            }
        )
    })
}
const get_pairs = (result, i) => {
    return new Promise((resolve, reject)=> {
        connection.query(
            'SELECT * FROM `pairs` WHERE' +  '`id` = ' + result[i].pair_id,
            function(err, results, fields) {
                return resolve(results);
            }
        );
    })
}
const get_address = (result) =>{
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
const get_prices_DB = (result_dex, result_address, i) => {
        if(result_dex[0].exchange === "pancakeswap"){
                pancakePricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
        }else if(result_dex[0].exchange === "mdex"){
                mdexPricesDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
        }else if(result_dex[0].exchange === "kyber"){
                kyberDB(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, i);
        }else{
            console.log("Please add exchange to codes first.")
        }
}
module.exports.mainDB = async(req, res) => {
    try{
        const result_info = await get_info()
        for(let i = 0; i < result_info.length; i++){
            const result_dex = await get_dex(result_info, i);
            const result_pairs = await get_pairs(result_info, i);
            const result_address = await get_address(result_pairs);
            await get_prices_DB(result_dex, result_address, i+1);
        }
    }catch(e){
        console.log(e);
    }
}

const get_prices = (result_dex, result_address, i) => {
    if(result_dex[0].exchange === "pancakeswap"){
            pancakePrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "mdex"){
            mdexPrices(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug, i);
    }else if(result_dex[0].exchange === "kyber"){
            kyber(result_address[0][0].address, result_address[1][0].address, result_address[0][0].coin, result_address[1][0].coin, result_address[0][0].slug, result_address[1][0].slug);
    }else{
        console.log("Please add exchange to codes first.")
    }
}
module.exports.main = async(req, res) => {
try{
    const result_info = await get_info()
    for(let i = 0; i < result_info.length; i++){
        const result_dex = await get_dex(result_info, i);
        const result_pairs = await get_pairs(result_info, i);
        const result_address = await get_address(result_pairs);
        await get_prices(result_dex, result_address, i+1);
    }
}catch(e){
    console.log(e);
}
}