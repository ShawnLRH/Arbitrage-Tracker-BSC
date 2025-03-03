# Arbitrage-Bot-BSC

This is an Arbitraging Trading bot codebase used on the Binance Smart Chain.

What this does:

- It retrieves price data from DeFi exchanges on the BSC chain.
- Takes the information and stores them on a SQL database.
- Uses prices to compare and find Arbitraging Opportunities.
- Activates a flashloan Smart contract when opportunity is found. (Work in Progress)
- Sends a Alert when opportunity is found.
- Maps price data on a Chart.

How to run?

Arbitrage Bot:
1. Git clone the repo.
2. Open your Terminal
3. cd Major-Project-BSC
4. npm install to get all dependencies
5. Set-up a getblock.io account and get your api key
6. Get the link to call a BSC node
7. Create a Telegram bot using botfather and get the key
8. Set up database (Refer Below)
9. Fill in the info at env_example and rename it to .env
10. Open terminal and go into the Major-Project-Bsc directory
11. node index.js to run the codes

Database set-up:
1. Download a mysql reader. MAMP for macbook and xampp for windows.
2. Run the database tables and create a new table
3. Import the arbitraging database provided
4. Record down your user login, password and table name for .env

Toggle on or off console logging:
1. LOGGING = 0 in .env to activate logging
2. Remove the 0 and leave LOGGING empty to deactivate logging

Thanks for reading!
