import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { makeGrid } from "../map-generator";
import hre = require("hardhat");

async function main() {
  const gamez = await hre.ethers.getContractAt(
    "Gamez",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  );

  await gamez.stakeLandAndTower(1, 1);
  await gamez.unstakeLandAndTower(1, 1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
