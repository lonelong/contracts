const { ethers } = require("hardhat");

async function main() {
  const Factory = await ethers.getContractFactory("LogWriter");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const addr = await contract.getAddress();
  console.log("LogWriter deployed to:", addr);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
