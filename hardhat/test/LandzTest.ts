import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { parseEther } from "ethers/lib/utils"
import { ethers } from "hardhat"
import { genFinalMap } from "../scripts/map-generator"

describe('Landz', function() {

    const landPrice = parseEther('1')
    const TWO_DAYS_IN_SECS = 2 * 24 * 60 * 60;

    async function init(){

        const [owner, bob, alice] = await ethers.getSigners()

        const Landz = await ethers.getContractFactory("Landz")
        const landz = await Landz.deploy()

        return {landz, owner, bob, alice}
    }

    describe('constructor', function(){
        it('should init', async function (){
            const {landz, owner} = await loadFixture(init)

            const name = await landz.name();
            const symbol = await landz.symbol();

             expect(name).to.be.equal("Landz");
             expect(symbol).to.be.equal("LANDZ");
        })
    })

    describe('createMap', function(){
        it('should create map', async function(){
              const {landz, owner} = await loadFixture(init)

              let map = genFinalMap(25, 15, 1)

              await landz.createMap(1, map)

              const tokenId1 = await landz.landInfo(1, 1)
              const tokenId2 = await landz.landInfo(1, 5)

              expect(tokenId1[0]).equal(1)
              expect(tokenId1[1]).equal(0)
              expect(tokenId1[2]).equal(0)
              expect(tokenId1[3]).equal(false)

              expect(tokenId2[0]).equal(5)
              expect(tokenId2[1]).equal(4)
              expect(tokenId2[2]).equal(0)
              expect(tokenId2[3]).equal(false)

        })
    })

    describe('mint', function(){
        it('should mint land', async function(){
              const {landz, owner} = await loadFixture(init)

              let map = genFinalMap(25, 15, 1)
              await landz.createMap(1, map)

              await landz.mint(1, 1, {value: landPrice})
              const balance = await landz.balanceOf(owner.address)
              const tokenId1 = await landz.landInfo(1, 1)

              expect(tokenId1[3]).equal(true)
              expect(balance).to.equal(1)
        })

        it('should revert with MapNotCreated()', async function(){
              const {landz, owner} = await loadFixture(init)

              const tx =  landz.mint(1, 1, {value: landPrice})

              await expect(tx).to.revertedWithCustomError(landz, "MapNotCreated")
        })

        it('should revert with AlreadyMinted()', async function(){
              const {landz, owner} = await loadFixture(init)

              let map = genFinalMap(25, 15, 1)
              await landz.createMap(1, map)

              await landz.mint(1, 1, {value: landPrice})
              const tx =  landz.mint(1, 1, {value: landPrice})

              await expect(tx).to.revertedWithCustomError(landz, "AlreadyMinted")
        })

        it('should revert with ValueIncorrect()', async function(){
              const {landz, owner} = await loadFixture(init)

              let map = genFinalMap(25, 15, 1)
              await landz.createMap(1, map)

              const tx =  landz.mint(1, 1, {value: parseEther('0.1')})

              await expect(tx).to.revertedWithCustomError(landz, "ValueIncorrect")
        })
    })

    describe('setUser', function(){
        it('should set user for renting', async function(){
              const {landz, owner, bob, alice} = await loadFixture(init)

              let map = genFinalMap(25, 15, 1)
              await landz.createMap(1, map)

              await landz.mint(1, 1, {value: landPrice})

              const unlockTime = (await time.latest()) + TWO_DAYS_IN_SECS;
              await landz.setUser(1, bob.address, unlockTime)

              const userOf1 = await landz.userOf(1)
              const ownerOf1 = await landz.ownerOf(1)
              const expire1 = await landz.userExpires(1)

              expect(userOf1).to.equal(bob.address)
              expect(ownerOf1).to.equal(owner.address)
              expect(expire1).to.equal(unlockTime)
        })

         it('should expire after given time', async function(){
              const {landz, owner, bob } = await loadFixture(init)

              let map = genFinalMap(25, 15, 1)
              await landz.createMap(1, map)

              await landz.mint(1, 1, {value: landPrice})

              const unlockTime = (await time.latest()) + TWO_DAYS_IN_SECS;
              await landz.setUser(1, bob.address, unlockTime)

              // increase time
              await time.increaseTo(unlockTime + 1);

              const userOf1 = await landz.userOf(1)
              const ownerOf1 = await landz.ownerOf(1)
              const expire1 = await landz.userExpires(1)

              expect(userOf1).to.equal(ethers.constants.AddressZero)
              expect(ownerOf1).to.equal(owner.address)
              expect(expire1).to.equal(unlockTime)
        })

        it('should revert with NotTheOwner()', async function(){
            const {landz, owner, bob, alice} = await loadFixture(init)

             let map = genFinalMap(25, 15, 1)
              await landz.createMap(1, map)
              await landz.mint(1, 1, {value: landPrice})

             const unlockTime = (await time.latest()) + TWO_DAYS_IN_SECS;
             const tx = landz.connect(bob).setUser(1, bob.address, unlockTime)

             await expect(tx).revertedWithCustomError(landz, "NotTheOwner")
        })

        it('should revert with UserAlreadyAssigned()', async function(){
            const {landz, owner, bob, alice} = await loadFixture(init)

             let map = genFinalMap(25, 15, 1)
             await landz.createMap(1, map)
             await landz.mint(1, 1, {value: landPrice})

             const unlockTime = (await time.latest()) + TWO_DAYS_IN_SECS;
             await landz.setUser(1, bob.address, unlockTime)
             const tx =  landz.setUser(1, alice.address, unlockTime)

             await expect(tx).revertedWithCustomError(landz, "UserAlreadyAssigned")
        })

        it('should revert with ExpireNotInTheFuture()', async function(){
            const {landz, owner, bob, alice} = await loadFixture(init)

             let map = genFinalMap(25, 15, 1)
             await landz.createMap(1, map)
             await landz.mint(1, 1, {value: landPrice})

             const unlockTime = (await time.latest()) - TWO_DAYS_IN_SECS;
             const tx =  landz.setUser(1, bob.address, unlockTime)

             await expect(tx).revertedWithCustomError(landz, "ExpireNotInTheFuture")
        })
    })

})