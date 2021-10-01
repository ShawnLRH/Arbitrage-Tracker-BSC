const Web3 = require('web3');
const { bakeryswap } = require('./bakeryswap');
const { kyber } = require('./kyber');
const { mdex } = require('./mdex');
const { pancakeswap } = require('./pancakeswap');

const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
  );

const init = async () => {
web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
      console.log(`New block received. Block # ${block.number}`);

      const prices = Promise.all([
        bakeryswap(),
        pancakeswap(),
        kyber(),
        mdex()
      ])

      
    })
    .on('error', error => {
        console.log(error);
    });
};
init();