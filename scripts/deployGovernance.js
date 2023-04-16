const hre = require("hardhat");

const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory('Governance');

  // gateways, destinations, protocols, gas receivers
  const gateways = ["0xC249632c2D40b9001FE907806902f63038B737Ab"];
  const destinations = ["arbitrum"];
  const protocols = ["0x166f65a4948111f91e034Ed93320F5432f5b637B"];
  const gas_receivers = ["0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"];

  const contract = await contractFactory.deploy(gateways, destinations, protocols, gas_receivers);
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  await contract.createVote(0, "Increase fee by 1%", 20);

  await contract.endVote(0, {value: ethers.utils.parseEther("2")});
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
