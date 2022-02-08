const { execSync } = require("child_process");
const args = " " + process.argv.slice(2).join(" ");
const execOption = { stdio: "inherit" };

const main = async () => {
  // get network from command line arguments; set to localhost if not passed
  let migrateCommand;
  // put together cmd for migrate
  if (args.includes("network")) {
    migrateCommand = 'truffle migrate' + args;
  } else {
    migrateCommand = 'truffle migrate' + args + ' --network localhost';
  }

  // run migrate command
  execSync(migrateCommand, execOption);

  // format properly for scaffold-eth using same network
  let formatCommand;
  if (args.network) {
    formatCommand = 'truffle exec scripts/scaffoldFormat.js --network' + args.network;
  } else {
    formatCommand = 'truffle exec scripts/scaffoldFormat.js' + ' --network localhost';
  }

  // run format command
  execSync(formatCommand, execOption);
}
main();
