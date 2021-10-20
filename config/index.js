const Web3 = require('web3');
const mysql = require('mysql2');
const {JsonRpcProvider} = require("@ethersproject/providers");
require('dotenv').config()

module.exports.provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');

module.exports.web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
  );
  
module.exports.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_PASS,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true
  });