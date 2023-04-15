require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  accounts.map(account => console.log(account.address));
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [process.env.TEST_PRIVATE_KEY]
    },
    arbitrum_goerli: {
      url: 'https://goerli-rollup.arbitrum.io/rpc',
      chainId: 421613,
      accounts: [process.env.TEST_PRIVATE_KEY]
    }
  }
};
