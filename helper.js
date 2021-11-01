const apeswap = require("./models/apeswap");
const Kyber = require("./models/kyber");
const Mdex = require("./models/mdex");
const Pancakeswap = require("./models/pancakeswap");
const sushiswap = require("./models/sushiswap");

const initExchange = (dexId, exchange) => {
    if (dexId == '1') {
        return new Pancakeswap();
    }else if (dexId == '2') {
        return new Kyber();
    }else if (dexId == '3') {
        return new Mdex();
    }else if (dexId == '4') {
        return new apeswap();
    }else if (dexId == '5') {
        return new sushiswap();
    }else{
        console.log("Please add exchange first");
    }
}

module.exports = initExchange;