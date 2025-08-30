import { ethers } from "hardhat";

async function main() {
  const [admin, producer, buyer, auditor, certifier, regulator] = await ethers.getSigners();
  const contractAddress = process.env.CONTRACTADDRESS;
  if (!contractAddress) {
    throw new Error("CONTRACTADDRESS environment variable is not set.");
  }

  const greenCredit = await ethers.getContractAt("GreenCredit", contractAddress);

  console.log("\n=== Simulation Start ===");

  // Certifier approves certificate ID=1 for producer
  const certifierConnected = greenCredit.connect(certifier);
  const txCert = await certifierConnected.approveCertificate(1, producer.address);
  await txCert.wait();
  console.log("Certifier approved certificate ID 1 for producer");

  // Producer issues 20 credits to buyer using approved cert
  const producerConnected = greenCredit.connect(producer);
  const tx1 = await producerConnected.issue(1, buyer.address, 20);
  await tx1.wait();
  console.log(`Producer issued 20 credits to Buyer (${buyer.address})`);

  // Check balance
  let bal = await greenCredit.balanceOf(buyer.address);
  console.log("Buyer balance:", bal.toString(), "credits");

  // Buyer uses 5 credits
  const buyerConnected = greenCredit.connect(buyer);
  const tx2 = await buyerConnected.useCredits(5);
  await tx2.wait();
  console.log("Buyer used 5 credits (burned)");

  bal = await greenCredit.balanceOf(buyer.address);
  console.log("Buyer balance after burn:", bal.toString());

  // Regulator pauses the system
  const regulatorConnected = greenCredit.connect(regulator);
  await regulatorConnected.pause();
  console.log("Regulator paused the system");

  // Try issuing while paused (should fail)
  try {
    await producerConnected.issue(1, buyer.address, 10);
  } catch (err) {
    console.log("Issue failed while paused (as expected)");
  }

  // Regulator unpauses
  await regulatorConnected.unpause();
  console.log("Regulator unpaused the system");

  // Auditor checks logs
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
