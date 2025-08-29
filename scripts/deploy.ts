import { ethers } from "hardhat";

async function main() {
  // Deploy GreenCredit only
  const GreenCredit = await ethers.getContractFactory("GreenCredit");
  const greenCredit = await GreenCredit.deploy();
  await greenCredit.waitForDeployment();

  console.log("GreenCredit deployed to:", await greenCredit.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
