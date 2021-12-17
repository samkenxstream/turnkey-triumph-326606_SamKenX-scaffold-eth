const fse = require("fs-extra");
const chalk = require("chalk");
const path = require("path");

const main = async (callback) => {

  fse.readdir(config.contracts_build_directory).then(files => {
    // don't remove external_contracts file, it is used by the react frontend
    return Promise.all(
      files.filter(file => !file.includes("external"))
        .map(file => { fse.remove(path.join(config.contracts_build_directory, file)) }));
  })
  console.log(chalk.bold.cyanBright("All truffle artifacts removed from build directory.",
    "\n",
    "Compile and/or migrate to generate new artifacts"));
}

module.exports = main;
