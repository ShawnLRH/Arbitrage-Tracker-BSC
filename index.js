const cron = require('node-cron');
const { web3 } = require('./config');
const { main, mainDB, retrieve_price_method, insert_database_method, comparePriceMethod } = require('./controller');

cron.schedule('*/15 * * * *', () => {
    insert_database_method();
    console.log('Running main controller daily...');
});

web3.eth.subscribe('newBlockHeaders')
    .on('data', async block => {
      console.log(`New block received. Block # ${block.number}`);

        //await retrieve_price_method()
        await comparePriceMethod();


    })
    .on('error', error => {
        console.log(error);
    });