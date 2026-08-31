import { ethers } from "hardhat";

async function main() {
  const ProofAnchor = await ethers.getContractFactory("ProofAnchor");
  const proofAnchor = await ProofAnchor.deploy();

  await proofAnchor.waitForDeployment();

  console.log(`ProofAnchor deployed to ${await proofAnchor.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
