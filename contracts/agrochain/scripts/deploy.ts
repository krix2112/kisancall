import { ethers } from "hardhat";

async function main() {
  const ProofAnchor = await ethers.getContractFactory("ProofAnchor");
  const proofAnchor = await ProofAnchor.deploy();

  const deployTx = proofAnchor.deploymentTransaction();
  await proofAnchor.waitForDeployment();

  const address = await proofAnchor.getAddress();
  console.log(`ProofAnchor deployed to ${address}`);
  console.log(`Deployment tx hash: ${deployTx?.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
