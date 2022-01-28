const fse = require("fs-extra");
const path = require("path");

const main = async (callback) => {
  const buildDirectory = config.contracts_build_directory;
  const contractsFile = '../react-app/src/contracts/deployed_contracts.json';
  const network = config.network;
  const networkId = config.networks[network].network_id;

  const artifacts = fse.readdirSync(buildDirectory);
  let reactContracts = {};

  reactContracts[networkId] = {
    [network]: {
      name: network,
      chainId: networkId,
      contracts: {}
    }
  };

  const builtContracts = artifacts.map((file => {
    const artifact = require(path.join(buildDirectory, file));

    let contract = {};
    reactContracts[networkId][network].contracts[artifact.contractName] = {
      address: artifact.networks[networkId].address,
      abi: artifact.abi
    }
    return contract;
  }));
  // reactContracts[networkId][network].contracts = builtContracts;
  fse.writeFileSync(contractsFile, JSON.stringify(reactContracts, null, 2));
  callback();
}
module.exports = main;
