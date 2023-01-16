import {
  Alchemy,
  AlchemyWebSocketProvider,
  Contract,
  Network,
} from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";
import { Subject } from "rxjs";
import gameService from "../db/GamezService";
import landService from "../db/LandService";
import towerService from "../db/TowerService";
import { log } from "../tools/logger";
import {
  LandMintedEvent,
  TowerStakingEvent,
  TowerUnstakingEvent,
  UpdateEvent,
  WebSocketProvider,
} from "./Web3SocketProvider";

export class DefaultSocketProvider implements WebSocketProvider {
  // provider = new ethers.providers.WebSocketProvider(
  //   "wss://polygon-mumbai.g.alchemy.com/v2/7DeCsPjsUaCniL1QbcRLrqHOMQ7lpw5-"
  // );

  alchemy = new Alchemy({
    apiKey: "7DeCsPjsUaCniL1QbcRLrqHOMQ7lpw5-",
    network: Network.MATIC_MUMBAI,
  });

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

  async listenAll() {
    log.info("Listen to contract events");

    const provider = await this.alchemy.config.getWebSocketProvider();

    this.listenLandzEvent(provider);
    this.listenTowerEvents(provider);
    this.listenGamezEvents(provider);
  }

  listenGamezEvents(provider: AlchemyWebSocketProvider) {
    let contract = new Contract(
      ethers.utils.getAddress(process.env.GAMEZ_CONTRACT),
      this.gamezAbi,
      provider
    );

    contract.on("Staking", async (from, landId, towerId, e) => {
      try {
        const tower = BigNumber.from(towerId).toNumber();
        const land = BigNumber.from(landId).toNumber();
        log.info(from + " stacking land#" + land + " tower#" + tower);

        const inGame = await gameService.create(tower, land, from);

        let stack: TowerStakingEvent = {
          name: "TowerStakingEvent",
          towerId: inGame.towerId,
          landId: inGame.landId,
          mapId: inGame.mapId,
          from: from,
        };
        log.info(
          "Dispatch TowerStakingEvent " +
            " land#" +
            stack.landId +
            " tower#" +
            stack.towerId +
            " map#" +
            stack.mapId
        );
        this.updateSubject.next(stack);
      } catch (e) {
        log.error(e);
      }
    });

    contract.on("Unstaking", async (from, landId, towerId, e) => {
      try {
        const tower = BigNumber.from(towerId).toNumber();
        const land = BigNumber.from(landId).toNumber();
        log.info(from + " Unstacking Land#" + land + " with Tower#" + tower);

        const inGame = await gameService.findGameByLandId(land);

        await gameService.remove(tower, land);

        let unstack: TowerUnstakingEvent = {
          name: "TowerUnstakingEvent",
          towerId: tower,
          landId: land,
          mapId: inGame.mapId,
        };
        log.info(
          "Dispatch TowerUnstakingEvent " +
            " land#" +
            unstack.landId +
            " tower#" +
            unstack.towerId +
            " map#" +
            unstack.mapId
        );
        this.updateSubject.next(unstack);
      } catch (e) {
        log.error(e);
      }
    });
  }

  listenLandzEvent(provider: AlchemyWebSocketProvider) {
    let contract = new Contract(
      ethers.utils.getAddress(process.env.LANDZ_CONTRACT),
      this.landzAbi,
      provider
    );

    const mintFilter = contract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );

    // used to listen when a land is minted. state is updated in the db and spread to clients
    contract.on(mintFilter, async (from, to, tokenId, e) => {
      try {
        const landId = BigNumber.from(tokenId).toNumber();
        log.info("New Land minted: #" + landId + " to " + to);
        await landService.updateLandToMinted(landId);

        let landMinted: LandMintedEvent = {
          tokenId: landId,
          name: "LandMintedEvent",
        };
        log.info("Dispatch LandMintedEvent land#" + landMinted.tokenId);
        this.updateSubject.next(landMinted);
      } catch (e) {
        console.error(e);
      }
    });
  }

  listenTowerEvents(provider: AlchemyWebSocketProvider) {
    let contract = new Contract(
      ethers.utils.getAddress(process.env.TOWERZ_CONTRACT),
      this.towerzAbi,
      provider
    );

    const mintFilter = contract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );

    contract.on(mintFilter, async (from, to, tokenId, e) => {
      try {
        const towerId = BigNumber.from(tokenId).toNumber();
        log.info("New Tower minted: #" + towerId + " to " + to);
        const tower = await towerService.createTower(towerId, 1);
        log.info(
          "Tower added to db #" + tower.id + " dmg " + tower.damage,
          +" speed " + tower.speed
        );
      } catch (e) {
        console.error(e);
      }
    });
  }

  contractUpdatesSubject(): Subject<UpdateEvent> {
    return this.updateSubject;
  }
}

export const contractUpdates = new DefaultSocketProvider();
