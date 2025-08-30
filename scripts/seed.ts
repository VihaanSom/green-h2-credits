import { ethers } from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // <-- replace with your deployed address
  const buyerWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";   // <-- your MetaMask/local account

  const contract = await ethers.getContractAt("GreenCredit", CONTRACT_ADDRESS);
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Seeding contract at", CONTRACT_ADDRESS);
  console.log("Deployer:", deployer.address);
  console.log("Buyer:", buyerWallet);

  // === Grant Roles ===
  const buyerRole = await contract.BUYER_ROLE();
  const producerRole = await contract.PRODUCER_ROLE();
  const certifierRole = await contract.CERTIFIER_ROLE();

  console.log("⚡ Granting BUYER_ROLE to", buyerWallet);
  await (await contract.grantRole(buyerRole, buyerWallet)).wait();

  console.log("⚡ Granting PRODUCER_ROLE + CERTIFIER_ROLE to deployer");
  await (await contract.grantRole(producerRole, deployer.address)).wait();
  await (await contract.grantRole(certifierRole, deployer.address)).wait();

  // === Approve a certificate ===
  console.log("📜 Approving certificate #1 with 100 volume");
  await (await contract.approveCertificate(1, deployer.address, 100)).wait();

  // === Issue credits ===
  console.log("💰 Issuing 100 credits to buyer");
  await (await contract.issue(1, buyerWallet, 100)).wait();

  const bal = await contract.balanceOf(buyerWallet);
  console.log("✅ Buyer balance seeded:", bal.toString(), "GC");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
