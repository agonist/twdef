import { Network, Alchemy, Contract } from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";
import { Subject } from "rxjs";
import { landService } from "../db/LandService";

export class AlchemySetup {
  settings = {
    apiKey: "7DeCsPjsUaCniL1QbcRLrqHOMQ7lpw5-", // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
    URL: "http://127.0.0.1:8545/",
  };

  provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545/");

  public updateSubject: Subject<number> = new Subject();

  init() {
    this.listenLandz();
    this.listenGamez();
  }

  listenGamez() {
    let abi = [
      "event Staking(address indexed from, uint256 _landId, uint256 _towerId)",
      "event Unstaking(address indexed from, uint256 _landId, uint256 _towerId)",
    ];

    let contract = new Contract(process.env.GAMEZ_CONTRACT, abi, this.provider);

    contract.on("Staking", (from, landId, towerId, e) => {
      console.log(
        "STAKING -FROM => " +
          from +
          " -LandId => " +
          BigNumber.from(landId) +
          " -TowerId => " +
          BigNumber.from(towerId)
      );

      console.log("---- EVENT");
      console.log(e);
    });

    contract.on("Unstaking", (from, landId, towerId, e) => {
      console.log(
        "UNSTAKING -FROM => " +
          from +
          " -LandId => " +
          BigNumber.from(landId) +
          " -TowerId => " +
          BigNumber.from(towerId)
      );

      console.log("---- EVENT");
      // console.log(e);
    });
  }

  listenLandz() {
    let abi = [
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ];

    let contract = new Contract(process.env.LANDZ_CONTRACT, abi, this.provider);

    const mintFilter = contract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );

    contract.on(mintFilter, async (from, to, tokenId, e) => {
      console.log("GM MINT");
      await landService.updateLandToMinted(BigNumber.from(tokenId).toNumber());
      this.updateSubject.next(tokenId);
    });
  }
}

export const contractUpdates = new AlchemySetup();
