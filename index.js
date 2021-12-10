const cron = require('node-cron');
const { web3 } = require('./config');
const { main, mainDB, retrieve_price_method, insert_database_method, comparePriceMethod, comparePriceMethodDB } = require('./controller');

//run controller codes every 5 minutes
cron.schedule('*/5 * * * *', () => {
    insert_database_method();
    comparePriceMethod();
    console.log('Running main controller daily...');
});