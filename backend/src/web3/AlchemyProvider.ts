import { Network, Alchemy, Contract } from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";

export class AlchemySetup {
  settings = {
    apiKey: "7DeCsPjsUaCniL1QbcRLrqHOMQ7lpw5-", // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
    URL: "http://127.0.0.1:8545/",
  };

  init() {
    let abi = [
      "event Staking(address indexed from, uint256 _landId, uint256 _towerId)",
      "event Unstaking(address indexed from, uint256 _landId, uint256 _towerId)",
    ];
    var provider = new ethers.providers.WebSocketProvider(
      "ws://127.0.0.1:8545/"
    );

    let contract = new Contract(
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      abi,
      provider
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
}
