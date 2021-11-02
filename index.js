const cron = require('node-cron');
const { web3 } = require('./config');
const { main, mainDB, retrieve_price_method, insert_database_method, comparePriceMethod, comparePriceMethodDB } = require('./controller');

cron.schedule('*/1 * * * *', () => {
    insert_database_method();
    comparePriceMethod();
    console.log('Running main controller daily...');
});

// web3.eth.subscribe('newBlockHeaders')
//     .on('data', async block => {
//       console.log(`New block received. Block # ${block.number}`);

        //await retrieve_price_method()


    // })
    // .on('error', error => {
    //     console.log(error);
    //});