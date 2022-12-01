import { Network, Alchemy, Contract } from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";
import { Subject } from "rxjs";
import { landService } from "../db/LandService";
import {
  LandMintedEvent,
  UpdateEvent,
  WebSocketProvider,
} from "./Web3SocketProvider";

export class DefaultSocketProvider implements WebSocketProvider {
  settings = {
    apiKey: "7DeCsPjsUaCniL1QbcRLrqHOMQ7lpw5-", // Replace with your Alchemy API Key.
    network: Network.MATIC_MUMBAI, // Replace with your network.
    URL: "http://127.0.0.1:8545/",
  };

  provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545/");

  updateSubject: Subject<UpdateEvent> = new Subject();

  gamezAbi = [
    "event Staking(address indexed from, uint256 _landId, uint256 _towerId)",
    "event Unstaking(address indexed from, uint256 _landId, uint256 _towerId)",
  ];

  landzAbi = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  ];

  listenAll() {
    this.listenLandzEvent();
    this.listenGamezEvents();
  }

  listenGamezEvents() {
    let contract = new Contract(
      process.env.GAMEZ_CONTRACT,
      this.gamezAbi,
      this.provider
    );

    contract.on("Staking", (from, landId, towerId, e) => {
      // add proper logger
    });

    contract.on("Unstaking", (from, landId, towerId, e) => {
      // add proper logger
    });
  }

  listenLandzEvent() {
    let contract = new Contract(
      process.env.LANDZ_CONTRACT,
      this.landzAbi,
      this.provider
    );

    const mintFilter = contract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );

    // used to listen when a land is minted. state is updated in the db and spread to clients
    contract.on(mintFilter, async (from, to, tokenId, e) => {
      await landService.updateLandToMinted(BigNumber.from(tokenId).toNumber());

      let landMinted: LandMintedEvent = {
        tokenId: BigNumber.from(tokenId).toNumber(),
        name: "LandMintedEvent",
      };

      this.updateSubject.next(landMinted);
    });
  }

  contractUpdatesSubject(): Subject<UpdateEvent> {
    return this.updateSubject;
  }
}

export const contractUpdates = new DefaultSocketProvider();
