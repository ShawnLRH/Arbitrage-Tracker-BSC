const Flashloan = artifacts.require("Arbitrage.sol");

module.exports = function (deployer) {
  deployer.deploy(
    Flashloan,
    '0x6725F303b657a9451d8BA641348b6761A6CC7a17', //PancakeSwap factory
    '0x3380aE82e39E42Ca34EbEd69aF67fAa0683Bb5c1', //ApeSwap router
  );
};