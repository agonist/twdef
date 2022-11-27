import { Network, Alchemy, Contract } from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";
import { landService } from "../db/LandService";

export class AlchemySetup {
  settings = {
    apiKey: "7DeCsPjsUaCniL1QbcRLrqHOMQ7lpw5-", // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
    URL: "http://127.0.0.1:8545/",
  };

  provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545/");

  init() {
    this.listenLandz();
    this.listenGamez();
  }

  listenGamez() {
    let abi = [
      "event Staking(address indexed from, uint256 _landId, uint256 _towerId)",
      "event Unstaking(address indexed from, uint256 _landId, uint256 _towerId)",
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ];

    let contract = new Contract(
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      abi,
      this.provider
    );

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
      console.log(e);
    });
  }

  listenLandz() {
    let abi = [
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ];

    let contract = new Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      abi,
      this.provider
    );

    contract.on("Transfer", async (from, to, tokenId, e) => {
      await landService.updateLandToMinted(BigNumber.from(tokenId).toNumber());
    });
  }
}
