import { ethers } from "hardhat";

async function main() {
  const [deployer, producer, buyer, auditor, certifier, regulator] = await ethers.getSigners();

  const GreenCredit = await ethers.deployContract("GreenCredit");
  await GreenCredit.waitForDeployment();

  console.log("✅ GreenCredit deployed at:", GreenCredit.target);

  // Grant roles
  await GreenCredit.grantRole(await GreenCredit.PRODUCER_ROLE(), producer.address);
  await GreenCredit.grantRole(await GreenCredit.BUYER_ROLE(), buyer.address);
  await GreenCredit.grantRole(await GreenCredit.AUDITOR_ROLE(), auditor.address);
  await GreenCredit.grantRole(await GreenCredit.CERTIFIER_ROLE(), certifier.address);
  await GreenCredit.grantRole(await GreenCredit.REGULATOR_ROLE(), regulator.address);

  console.log("✅ Roles assigned to Producer, Buyer, Auditor, Certifier, Regulator");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
