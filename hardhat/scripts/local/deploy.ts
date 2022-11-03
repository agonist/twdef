import { ethers } from "hardhat";

async function main() {

  const Land = await ethers.getContractFactory("Land");
  const land = await Land.deploy();

  await land.deployed();

  const lands: {x:number, y:number, id: number, minted: boolean}[] =  []

  for (let i = 0; i < 10; i++) {
    lands.push({x: i, y: 0, id: lands.length + 1, minted: false})
  }
    for (let i = 0; i < 10; i++) {
    lands.push({x: i, y: 2, id: lands.length + 1, minted: false})
  }

  
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
