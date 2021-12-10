const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

//Get latest coin rpices from coingecko
module.exports.getLatestCoinPrice = async(slug) => {
    try{
        const price = await CoinGeckoClient.coins.markets({
            vs_currency: 'usd',
            ids: [slug]
        });
    return price.data[0].current_price;
}catch(e){
    console.log(e);
}
}
