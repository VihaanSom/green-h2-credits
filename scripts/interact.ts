import { ethers } from "hardhat";

async function main() {
  const [admin, producer, buyer, auditor] = await ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace after deploy

  const greenCredit = await ethers.getContractAt("GreenCredit", contractAddress);

  console.log("\n=== Simulation Start ===");

  // Producer issues 10 credits to buyer
  const producerConnected = greenCredit.connect(producer);
  const tx1 = await producerConnected.issue(buyer.address, 10);
  await tx1.wait();
  console.log(`Producer issued 10 credits to Buyer (${buyer.address})`);

  // Check balance
  let bal = await greenCredit.balanceOf(buyer.address);
  console.log("Buyer balance:", bal.toString(), "credits");

  // Buyer uses 4 credits
  const buyerConnected = greenCredit.connect(buyer);
  const tx2 = await buyerConnected.useCredits(4);
  await tx2.wait();
  console.log("Buyer used 4 credits (burned)");

  bal = await greenCredit.balanceOf(buyer.address);
  console.log("Buyer balance after burn:", bal.toString());

  // Auditor reads past events
  console.log("\nAuditor checking logs...");
  const issuedEvents = await greenCredit.queryFilter(greenCredit.filters.CreditsIssued());
  const burnedEvents = await greenCredit.queryFilter(greenCredit.filters.CreditsBurned());

  console.log("Issued Events:", issuedEvents.map(e => e.args));
  console.log("Burned Events:", burnedEvents.map(e => e.args));

  console.log("\n=== Simulation Complete ===");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
