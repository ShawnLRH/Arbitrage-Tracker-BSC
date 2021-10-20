const Web3 = require('web3');
const cron = require('node-cron');
const { main, mainDB, retrieve_price_method, insert_database_method } = require('./controller');

cron.schedule('*/15 * * * *', () => {
    insert_database_method();
    console.log('Running main controller daily...');
});
const web3 = new Web3(
    new Web3.providers.WebsocketProvider(process.env.INFURA_URL)
  );

const init = async () => {
web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
      console.log(`New block received. Block # ${block.number}`);

      const prices = Promise.all([
        await retrieve_price_method()
      ])


    })
    .on('error', error => {
        console.log(error);
    });
};
init();