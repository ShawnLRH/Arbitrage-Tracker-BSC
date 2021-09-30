require('dotenv').config()
const Web3 = require('web3');
const { ChainId: chainIdKyber, Fetcher: fetcherKyber, Route } = require('@dynamic-amm/sdk');
const abis = require('./abis');
const { mainnet: addresses } = require('./addresses');
const {JsonRpcProvider} = require("@ethersproject/providers");
const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
);

const AMOUNT_BNB = 100;
let RECENT_BNB_PRICE = 353;
const AMOUNT_BNB_WEI = web3.utils.toWei(AMOUNT_BNB.toString());
const AMOUNT_USDT_WEI = web3.utils.toWei((AMOUNT_BNB * RECENT_BNB_PRICE).toString());

const init = async () => {
  const [busdKyber, usdtKyber] = await Promise.all(
    [addresses.tokens.busd, addresses.tokens.usdt].map(tokenAddress => (
      fetcherKyber.fetchTokenData(
        chainIdKyber.BSCMAINNET,
        tokenAddress,
        provider
      )
  )));

  const usdtbusdKyber = await fetcherKyber.fetchPairData(
    usdtKyber,
    busdKyber,
    "0x878dFE971d44e9122048308301F540910Bbd934c",
    provider
  );

  console.log(usdtbusdKyber);

  web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
        console.log(`New block received. Block # ${block.number}`);

        const route = new Route(usdtbusdKyber, usdtKyber);

        const kyberRates = {
            Buy: route.midPrice.toSignificant(6),
            Sell: route.midPrice.invert().toSignificant(6)
        }

        console.log('Kyber USDT/BUSD')
        console.log(kyberRates);
    })
    .on('error', error => {
      console.log(error);
    });
}
init();