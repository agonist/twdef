import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { genFinalMap } from "../scripts/map-generator";
import { landPrice } from "./utils/constants";

describe("Gamez", function () {
  async function init() {
    const [owner, bob, alice] = await ethers.getSigners();

    const Landz = await ethers.getContractFactory("Landz");
    const landz = await Landz.deploy();

    const Towerz = await ethers.getContractFactory("Towerz");
    const towerz = await Towerz.deploy();

    const Gamez = await ethers.getContractFactory("Gamez");
    const gamez = await Gamez.deploy(landz.address, towerz.address);

    // some init stuff
    let map = genFinalMap(25, 15, 1);
    await landz.createMap(1, map);

    await landz.mint(1, 1, { value: landPrice });

    await towerz.mint(1, 1);

    return { landz, towerz, gamez, owner, bob, alice };
  }

  describe("stakeLandAndTower", function () {
    it("should stake a land and a tower", async function () {
      const { gamez, towerz, landz, owner } = await loadFixture(init);

      await landz.setApprovalForAll(gamez.address, true);
      await towerz.setApprovalForAll(gamez.address, true);

      await expect(gamez.stakeLandAndTower(1, 1))
        .to.emit(gamez, "Staking")
        .withArgs(owner.address, 1, 1);

      const balance = await gamez.getStakedTokens(owner.address);

      expect(balance[0][0]).to.equal(BigNumber.from(1));
      expect(balance[1][0]).to.equal(BigNumber.from(1));
    });
  });

  describe("unstakeLandAndTower", function () {
    it("should unstake a land and a tower", async function () {
      const { gamez, towerz, landz, owner } = await loadFixture(init);

      await landz.setApprovalForAll(gamez.address, true);
      await towerz.setApprovalForAll(gamez.address, true);

      await gamez.stakeLandAndTower(1, 1);

      await expect(gamez.unstakeLandAndTower(1, 1))
        .to.emit(gamez, "Unstaking")
        .withArgs(owner.address, 1, 1);

      const balance = await gamez.getStakedTokens(owner.address);

      expect(balance[0].length).to.equal(0);
      expect(balance[1].length).to.equal(0);
    });
  });
});
