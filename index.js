const Web3 = require('web3');
const cron = require('node-cron');
const { main, mainDB } = require('./controller');

cron.schedule('17 * * * *', () => {
    mainDB();
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
        await main()
      ])


    })
    .on('error', error => {
        console.log(error);
    });
};
init();