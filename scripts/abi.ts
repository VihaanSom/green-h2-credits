import fs from "fs";
import path from "path";

async function main() {
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/GreenCredit.sol/GreenCredit.json"
  );

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  const outPath = "C:/Users/Admin/Desktop/College/Diploma/greencredit-frontend/src/GreenCredit.json";

  fs.writeFileSync(outPath, JSON.stringify(abi, null, 2));

  console.log("✅ ABI exported to frontend/src/GreenCredit.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
