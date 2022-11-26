import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { makeGrid } from "../map-generator";

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

  console.log("Landz _ : " + landz.address);
  console.log("Towerz _ : " + towerz.address);
  console.log("GAMEZ _ : " + gamez.address);

  const lands: { x: number; y: number; id: number; minted: boolean }[] = [];

  let map1 = makeGrid(25, 15, 1);

  for (let y = 0; y < 15; y += 1) {
    for (let x = 0; x < 25; x += 1) {
      if (map1[y][x] > 0) {
        lands.push({ x: x, y: y, id: map1[y][x], minted: false });
      }
    }
  }

  console.log(lands[lands.length - 1].id);

  const lands2: { x: number; y: number; id: number; minted: boolean }[] = [];
  let startId2 = lands[lands.length - 1].id + 1;
  let map2 = makeGrid(25, 25, startId2);

  for (let y = 0; y < 25; y += 1) {
    for (let x = 0; x < 25; x += 1) {
      if (map2[y][x] > 0) {
        lands2.push({ x: x, y: y, id: map2[y][x], minted: false });
      }
    }
  }
  console.log(lands2[lands2.length - 1].id);

  const lands3: { x: number; y: number; id: number; minted: boolean }[] = [];
  let startId3 = lands2[lands2.length - 1].id + 1;
  let map3 = makeGrid(15, 15, startId3);

  for (let y = 0; y < 15; y += 1) {
    for (let x = 0; x < 15; x += 1) {
      if (map3[y][x] > 0) {
        lands3.push({ x: x, y: y, id: map3[y][x], minted: false });
      }
    }
  }
  console.log(lands3[lands3.length - 1].id);

  await landz.createMap(1, lands);
  await landz.createMap(2, lands2);
  await landz.createMap(3, lands3);

  await landz.mint(1, 1, { value: parseEther("1") });
  await towerz.mint(1, 1);

  await landz.setApprovalForAll(gamez.address, true);
  await towerz.setApprovalForAll(gamez.address, true);
  // await gamez.stakeLandAndTower(1, 1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
