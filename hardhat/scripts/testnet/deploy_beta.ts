import { ethers } from "hardhat";
import {
  makeGrid,
  makeGridFromFileMap,
  map_1,
} from "../map-generator";

async function main() {
  const Landz = await ethers.getContractFactory("Landz");
  const landz = await Landz.deploy();

  await landz.deployed();

  const Towerz = await ethers.getContractFactory("Towerz");
  const towerz = await Towerz.deploy();

  await towerz.deployed();

  const Gamez = await ethers.getContractFactory("Gamez");
  const gamez = await Gamez.deploy(landz.address, towerz.address);

  await gamez.deployed();

  const ShopV1 = await ethers.getContractFactory("ShopV1");
  const shopV1 = await ShopV1.deploy(landz.address, towerz.address);

  await shopV1.deployed();

  console.log("Landz : " + landz.address);
  console.log("Towerz : " + towerz.address);
  console.log("GAMEZ : " + gamez.address);
  console.log("ShopV1 : " + shopV1.address);

  await landz.setMinter(shopV1.address, true);
  await towerz.setMinter(shopV1.address, true);

  const lands: { x: number; y: number; id: number; minted: boolean }[] = [];

  let map1 = makeGridFromFileMap(map_1, 30, 20, 1);

  for (let y = 0; y < 20; y += 1) {
    for (let x = 0; x < 30; x += 1) {
      if (map1[y][x] > 0) {
        lands.push({ x: x, y: y, id: map1[y][x], minted: false });
      }
    }
  }

  await landz.createMap(1, lands);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
