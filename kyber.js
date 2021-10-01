require('dotenv').config()
const Web3 = require('web3');
const { ChainId, Fetcher, Route } = require('@dynamic-amm/sdk');
const abis = require('./abis');
const { mainnet: addresses } = require('./addresses');
const {JsonRpcProvider} = require("@ethersproject/providers");
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);

module.exports.kyber = async () => {
  const [busd, usdt] = await Promise.all(
    [addresses.tokens.busd, addresses.tokens.usdt].map(tokenAddress => (
      Fetcher.fetchTokenData(
        ChainId.BSCMAINNET,
        tokenAddress,
        provider
      )
  )));

  const usdtbusd = await Fetcher.fetchPairData(
    usdt,
    busd,
    "0x878dFE971d44e9122048308301F540910Bbd934c",
    provider
  );

        const route = new Route(usdtbusd, usdt);

        const kyberRates = {
            Buy: route.midPrice.toSignificant(6),
            Sell: route.midPrice.invert().toSignificant(6)
        }

        console.log('Kyber USDT/BUSD')
        console.log(kyberRates);
}