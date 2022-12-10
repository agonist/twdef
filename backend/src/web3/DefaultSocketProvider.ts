import { Network, Alchemy, Contract } from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";
import { Subject } from "rxjs";
import { gameService } from "../db/GamezService";
import { landService } from "../db/LandService";
import { towerService } from "../db/TowerService";
import {
  LandMintedEvent,
  TowerStakingEvent,
  TowerUnstakingEvent,
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

  towerzAbi = [
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

    contract.on("Staking", async (from, landId, towerId, e) => {
      // add proper logger
      const tower = BigNumber.from(towerId).toNumber();
      const land = BigNumber.from(landId).toNumber();
      console.log("Stacking Land#" + land + " with Tower#" + tower);
      const inGame = await gameService.create(tower, land);

      let stack: TowerStakingEvent = {
        name: "TowerStakingEvent",
        towerId: tower,
        landId: land,
      };

      this.updateSubject.next(stack);
    });

    contract.on("Unstaking", async (from, landId, towerId, e) => {
      const tower = BigNumber.from(towerId).toNumber();
      const land = BigNumber.from(landId).toNumber();

      console.log("Unstacking Land#" + land + " with Tower#" + tower);
      await gameService.remove(tower, land);

      let unstack: TowerUnstakingEvent = {
        name: "TowerUnstakingEvent",
        towerId: tower,
        landId: land,
      };
      this.updateSubject.next(unstack);
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
      console.log("New Land minted: #" + BigNumber.from(tokenId).toNumber());
      await landService.updateLandToMinted(BigNumber.from(tokenId).toNumber());

      let landMinted: LandMintedEvent = {
        tokenId: BigNumber.from(tokenId).toNumber(),
        name: "LandMintedEvent",
      };

      this.updateSubject.next(landMinted);
    });
  }

  listenTowerEvents() {
    let contract = new Contract(
      process.env.LANDZ_CONTRACT,
      this.towerzAbi,
      this.provider
    );

    const mintFilter = contract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );

    contract.on(mintFilter, async (from, to, tokenId, e) => {
      console.log("New Tower minted: #" + BigNumber.from(tokenId).toNumber());
      const tower = await towerService.createTower(
        BigNumber.from(tokenId).toNumber(),
        1
      );
      console.log(
        "Tower added to db #" + tower.id + " dmg " + tower.damage,
        +" speed " + tower.speed
      );
    });
  }

  contractUpdatesSubject(): Subject<UpdateEvent> {
    return this.updateSubject;
  }
}

export const contractUpdates = new DefaultSocketProvider();
