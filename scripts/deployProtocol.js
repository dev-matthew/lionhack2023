const hre = require("hardhat");

const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory('Protocol');

  const fuji_gateway = "0xe432150cce91c13a887f7D836923d5597adD8E31";
  const fuji_gas = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";
  const zero_address = "0x0000000000000000000000000000000000000000";

  const contract = await contractFactory.deploy(fuji_gateway, fuji_gas, 12);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

const runMain = async () => {
  try {
      await main();
      process.exit(0);
  } catch (error) {
      console.log(error);
      process.exit(1);
  }
}

runMain();
