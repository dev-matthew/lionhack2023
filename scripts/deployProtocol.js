const hre = require("hardhat");

const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory('Protocol');

  const fuji_gateway = "0xC249632c2D40b9001FE907806902f63038B737Ab";
  const fuji_gas = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";
  const zero_address = "0x0000000000000000000000000000000000000000";

  const contract = await contractFactory.deploy(fuji_gateway, fuji_gas, zero_address);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  /*const originalAddress = await contract.getLogicAddress();
  console.log(originalAddress);*/
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
