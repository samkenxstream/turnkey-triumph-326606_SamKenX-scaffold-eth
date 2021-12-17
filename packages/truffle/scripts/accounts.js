const HDWalletProvider = require('@truffle/hdwallet-provider');

const main = async (callback) => {
  // get list of available accounts
  const ganacheAccounts = await web3.eth.getAccounts();
  ganacheAccounts.forEach((account) => console.log(account));
  console.log("\n");

  callback();
}

module.exports = main;
