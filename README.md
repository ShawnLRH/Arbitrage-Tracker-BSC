# Major-Project-BSC

This is an Arbitraging Trading bot codebase used for my Major Project.

What this does:

- It retrieves price data from DeFi exchanges on the BSC chain.
- Takes the information and stores them on a SQL database.
- Uses prices to compare and find Arbitraging Opportunities.
- Activates a flashloan Smart contract when opportunity is found.
- Sends a Alert when opportunity is found.
- Maps price data on a Chart.

How to run?

1. Git clone the repo.
2. Go to the directory and run npm install.
3. Set up sql tables.
4. Make sure you have truffle installed.
5. Set up a Infura Account
6. Create a .env file and fill in your DB data and infura link.
7. Run the index.js in the main directory.

Thanks for reading!
