const gasPrice = await web3.eth.getGasPrice(prices1, prices2);
      //200000 is picked arbitrarily, have to be replaced by actual tx cost in next lectures, with Web3 estimateGas()
      const txCost = 200000 * parseInt(gasPrice);
      const currentEthPrice = (prices1.buy + prices1.sell) / 2; 
      const profit1 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices1.sell - prices2.buy) - (txCost / 10 ** 18) * currentEthPrice;
      const profit2 = (parseInt(AMOUNT_BNB_WEI) / 10 ** 18) * (prices2.sell - prices1.buy) - (txCost / 10 ** 18) * currentEthPrice;
      if(profit1 > 0) {
        console.log('Arb opportunity found!');
        console.log(`Buy ETH on Kyber at ${prices2.buy} dai`);
        console.log(`Sell ETH on Uniswap at ${prices1.sell} dai`);
        console.log(`Expected profit: ${profit1} dai`);
        //Execute arb Kyber <=> Uniswap
      } else if(profit2 > 0) {
        console.log('Arb opportunity found!');
        console.log(`Buy ETH from Uniswap at ${prices1.buy} dai`);
        console.log(`Sell ETH from Kyber at ${prices2.sell} dai`);
        console.log(`Expected profit: ${profit2} dai`);
        //Execute arb Uniswap <=> Kyber
      }