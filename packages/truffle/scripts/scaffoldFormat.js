const fse = require("fs-extra");
const path = require("path");

const main = async (callback) => {

  // take contracts from artifacts and turn them into the format expected in the react app file,
  // deployed_contracts.json
  async function builtContracts(artifacts, buildDirectory, networkId) {
    let contracts = {};
    artifacts.map((file => {
      const artifact = require(path.join(buildDirectory, file));
      contracts[artifact.contractName] = {
        address: artifact.networks[networkId].address,
        abi: artifact.abi
      }
    }));

    return contracts;
  }

  const network = config.network;
  const networkId = config.networks[network].network_id;
  const buildDirectory = config.contracts_build_directory;
  const contractsFile = '../react-app/src/contracts/deployed_contracts.json';
  const artifacts = fse.readdirSync(buildDirectory);
  const newContracts = await builtContracts(artifacts, buildDirectory, networkId);

  if (fse.existsSync(contractsFile)) {
    const deployedContracts = JSON.parse(await fse.readFile(contractsFile));

    if ([networkId] in deployedContracts) {
      const merged = { ...deployedContracts[networkId][network].contracts, ...newContracts };
      deployedContracts[networkId][network].contracts = merged;
      fse.writeFileSync(contractsFile, JSON.stringify(deployedContracts, null, 2));
    } else {
      deployedContracts[networkId] = {
        [network]: {
          name: network,
          chainId: networkId,
          contracts: newContracts
        }
      }
      fse.writeFileSync(contractsFile, JSON.stringify(deployedContracts, null, 2));
    }
  } else {
    let reactContracts = {};
    reactContracts[networkId] = {
      [network]: {
        name: network,
        chainId: networkId,
        contracts: newContracts
      }
    };
    fse.writeFileSync(contractsFile, JSON.stringify(reactContracts, null, 2));
  }

  callback();
}
module.exports = main;
