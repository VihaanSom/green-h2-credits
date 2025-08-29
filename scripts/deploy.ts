import { ethers } from "hardhat";

async function main() {
  const [admin, producer, buyer, auditor] = await ethers.getSigners();

  console.log("Deploying with admin:", admin.address);

  const GreenCredit = await ethers.getContractFactory("GreenCredit");
  const greenCredit = await GreenCredit.deploy();
  await greenCredit.waitForDeployment();

  console.log("GreenCredit deployed to:", await greenCredit.getAddress());

  // Assign roles
  await greenCredit.grantRole(await greenCredit.PRODUCER_ROLE(), producer.address);
  await greenCredit.grantRole(await greenCredit.AUDITOR_ROLE(), auditor.address);

  console.log("Producer role granted to:", producer.address);
  console.log("Auditor role granted to:", auditor.address);
  console.log("Buyer will be:", buyer.address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
