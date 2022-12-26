import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
  makeGrid,
  makeGridFromFileMap,
  map_1,
  map_2,
  map_3,
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

  console.log("Landz _ : " + landz.address);
  console.log("Towerz _ : " + towerz.address);
  console.log("GAMEZ _ : " + gamez.address);
  console.log("ShopV1 _ : " + shopV1.address);

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

  // console.log(lands[lands.length - 1].id);

  const lands2: { x: number; y: number; id: number; minted: boolean }[] = [];
  let startId2 = lands[lands.length - 1].id + 1;
  let map2 = makeGridFromFileMap(map_2, 15, 25, startId2);

  for (let y = 0; y < 25; y += 1) {
    for (let x = 0; x < 15; x += 1) {
      if (map2[y][x] > 0) {
        lands2.push({ x: x, y: y, id: map2[y][x], minted: false });
      }
    }
  }
  // console.log(lands2[lands2.length - 1].id);

  const lands3: { x: number; y: number; id: number; minted: boolean }[] = [];
  let startId3 = lands2[lands2.length - 1].id + 1;
  let map3 = makeGridFromFileMap(map_3, 15, 15, startId3);

  for (let y = 0; y < 15; y += 1) {
    for (let x = 0; x < 15; x += 1) {
      if (map3[y][x] > 0) {
        lands3.push({ x: x, y: y, id: map3[y][x], minted: false });
      }
    }
  }
  // console.log(lands3[lands3.length - 1].id);

  await landz.createMap(1, lands);
  await landz.createMap(2, lands2);
  await landz.createMap(3, lands3);

  // await gamez.stakeLandAndTower(1, 1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
