import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { makeGrid } from "../map-generator";
import hre = require("hardhat");

async function main() {
  const gamez = await hre.ethers.getContractAt(
    "Gamez",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  );
  const landz = await hre.ethers.getContractAt(
    "Landz",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  await landz.mint(1, 1, { value: parseEther("1") });
  // await towerz.mint(1, 1);

  await landz.setApprovalForAll(gamez.address, true);
  // await towerz.setApprovalForAll(gamez.address, true);

  // await gamez.stakeLandAndTower(1, 1);
  // await gamez.unstakeLandAndTower(1, 1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
