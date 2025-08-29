import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xD4C8755A90db5075cdf309C1146437Db3441768B"; 
 // replace with deployed address

  // Get deployed contract instance
  const GreenCredit = await ethers.getContractAt("GreenCredit", contractAddress);

  // Read current total credits
  let credits = await GreenCredit.totalCredits();
  console.log("Total credits before issuing:", credits.toString());

  // Issue 100 credits
  const tx = await GreenCredit.issue(100);
  await tx.wait();

  // Read again
  credits = await GreenCredit.totalCredits();
  console.log("Total credits after issuing 100:", credits.toString());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
