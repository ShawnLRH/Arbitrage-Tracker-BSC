const Kyber = require("./models/kyber");
const Mdex = require("./models/mdex");
const Pancakeswap = require("./models/pancakeswap")

const initExchange = (dexId, exchange) => {
    if (dexId == 'pancakeswap') {
        return new Pancakeswap();
    }else if (dexId == 'kyber') {
        return new Kyber();
    }else if(dexId == 'mdex') {
        return new Mdex();
    }else{
        console.log("Please add exchange first");
    }
}

module.exports = initExchange;