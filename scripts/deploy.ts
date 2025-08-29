import { ethers } from "hardhat";

async function main() {
  const [deployer, producer, buyer, auditor] = await ethers.getSigners();

  const GreenCredit = await ethers.deployContract("GreenCredit");
  await GreenCredit.waitForDeployment();

  console.log("GreenCredit deployed at:", GreenCredit.target);

  // Grant roles
  await GreenCredit.grantRole(await GreenCredit.PRODUCER_ROLE(), producer.address);
  await GreenCredit.grantRole(await GreenCredit.BUYER_ROLE(), buyer.address);
  await GreenCredit.grantRole(await GreenCredit.AUDITOR_ROLE(), auditor.address);

  console.log("Roles assigned!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
