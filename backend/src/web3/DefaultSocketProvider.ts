import {
  Alchemy,
  AlchemyWebSocketProvider,
  Contract,
  Network,
} from "alchemy-sdk";
import { ethers, BigNumber } from "ethers";
import { min } from "lodash";
import { Subject } from "rxjs";
import eventService from "../db/EventService";
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
  
  alchemy = new Alchemy({
    apiKey: "7DeCsPjsUaCniL1QbcRLrqHOMQ7lpw5-",
    network: Network.MATIC_MUMBAI,
    url: "http://127.0.0.1:8545/",
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

  provider: ethers.providers.WebSocketProvider;
  landContract: Contract;
  towerContract: Contract;
  gamezContract: Contract;

  // Basically the init.
  async listenAll() {
    log.info("Listen to contract events");

    if (process.env.NODE_ENV === "development") {
      this.provider = new ethers.providers.WebSocketProvider(
        "ws://127.0.0.1:8545"
      );
    } else {
      this.provider = await this.alchemy.config.getWebSocketProvider();
    }

    this.landContract = new Contract(
      ethers.utils.getAddress(process.env.LANDZ_CONTRACT),
      this.landzAbi,
      this.provider
    );

    this.towerContract = new Contract(
      ethers.utils.getAddress(process.env.TOWERZ_CONTRACT),
      this.towerzAbi,
      this.provider
    );

    this.gamezContract = new Contract(
      ethers.utils.getAddress(process.env.GAMEZ_CONTRACT),
      this.gamezAbi,
      this.provider
    );

    this.listenLandzEvent();
    this.listenTowerEvents();
    this.listenGamezEvents();
    // await this.eventFallback();
  }

  // event coming from game contract
  listenGamezEvents() {
    this.gamezContract.on(
      this.gamezContract.filters.Staking(),
      async (from, landId, towerId, e) => {
        const tower = BigNumber.from(towerId).toNumber();
        const land = BigNumber.from(landId).toNumber();
        log.info(from + " stacking land#" + land + " tower#" + tower);
        await this.staked(from, land, tower);
        await this.updateLastBlock(e.blockNumber);
      }
    );

    this.gamezContract.on(
      this.gamezContract.filters.Unstaking(),
      async (from, landId, towerId, e) => {
        const tower = BigNumber.from(towerId).toNumber();
        const land = BigNumber.from(landId).toNumber();
        log.info(from + " Unstacking Land#" + land + " with Tower#" + tower);
        await this.unstaked(from, land, tower);
        await this.updateLastBlock(e.blockNumber);
      }
    );
  }

  // vent from land contract
  async listenLandzEvent() {
    const mintFilter = this.landContract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );

    this.landContract.on(mintFilter, async (from, to, tokenId, e) => {
      const landId = BigNumber.from(tokenId).toNumber();
      log.info("New Land minted: #" + landId + " to " + to);
      log.info(e);
      await this.newLandMinted(landId);
      await this.updateLastBlock(e.blockNumber);
    });
  }

  // event from tower contract
  listenTowerEvents() {
    const mintFilter = this.towerContract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );

    this.towerContract.on(mintFilter, async (from, to, tokenId, e) => {
      const towerId = BigNumber.from(tokenId).toNumber();
      log.info("New Tower minted: #" + towerId + " to " + to);
      await this.newTowerMinted(towerId);
      await this.updateLastBlock(e.blockNumber);
    });
  }

  async eventFallback() {
    const lastUpdated = (await eventService.getLastBlockEvent()) + 1;
    const lastBlock = await this.alchemy.core.getBlockNumber();
    if (lastUpdated === lastBlock || lastUpdated > lastBlock) return;

    log.info(
      "trying to restore event from " + lastUpdated + " to " + lastBlock
    );

    //  LAND
    const mintFilter = this.landContract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );
    // const lastBlockUpdated = 0; //get last value stored in db
    const logs = await this.alchemy.core.getLogs({
      fromBlock: lastUpdated,
      toBlock: lastBlock,
      address: ethers.utils.getAddress(process.env.LANDZ_CONTRACT),
      topics: mintFilter.topics,
    });
    log.info(logs.length + " Lands events to restore");

    logs.forEach(async (l) => {
      const parsed = this.landContract.interface.parseLog(l);
      const id = BigNumber.from(parsed.args[2]).toNumber();
      await this.newLandMinted(id);
    });
    // TOWER
    const mintFilterTower = this.towerContract.filters.Transfer(
      "0x0000000000000000000000000000000000000000"
    );
    // const lastBlockUpdated = 0; //get last value stored in db
    const logsTower = await this.alchemy.core.getLogs({
      fromBlock: lastUpdated,
      toBlock: lastBlock,
      address: ethers.utils.getAddress(process.env.TOWERZ_CONTRACT),
      topics: mintFilterTower.topics,
    });
    log.info(logsTower.length + " Tower events to restore");

    logsTower.forEach(async (l) => {
      const parsed = this.towerContract.interface.parseLog(l);
      const id = BigNumber.from(parsed.args[2]).toNumber();
      await this.newTowerMinted(id);
    });

    //  STAKING
    const s = this.gamezContract.filters.Staking();
    const logsStaking = await this.alchemy.core.getLogs({
      fromBlock: lastUpdated,
      toBlock: lastBlock,
      address: ethers.utils.getAddress(process.env.GAMEZ_CONTRACT),
      topics: s.topics,
    });
    log.info(logsStaking.length + " Stacking events to restore");

    logsStaking.forEach(async (l) => {
      const parsed = this.gamezContract.interface.parseLog(l);
      const from = parsed.args[0];
      const landId = BigNumber.from(parsed.args[1]).toNumber();
      const towerId = BigNumber.from(parsed.args[2]).toNumber();
      await this.staked(from, landId, towerId);
    });

    //  UNSTAKING
    const logsUnstaking = await this.alchemy.core.getLogs({
      fromBlock: lastUpdated,
      toBlock: lastBlock,
      address: ethers.utils.getAddress(process.env.GAMEZ_CONTRACT),
      topics: this.gamezContract.filters.Unstaking().topics,
    });
    log.info(logsUnstaking.length + " Unstacking events to restore");

    logsUnstaking.forEach(async (l) => {
      const parsed = this.gamezContract.interface.parseLog(l);
      const from = parsed.args[0];
      const landId = BigNumber.from(parsed.args[1]).toNumber();
      const towerId = BigNumber.from(parsed.args[2]).toNumber();
      await this.unstaked(from, landId, towerId);
    });
    await this.updateLastBlock(lastBlock);
  }

  async newLandMinted(landId: number) {
    try {
      await landService.updateLandToMinted(landId);

      let landMinted: LandMintedEvent = {
        tokenId: landId,
        name: "LandMintedEvent",
      };
      this.updateSubject.next(landMinted);
    } catch (e) {
      log.error(e);
    }
  }

  async newTowerMinted(towerId: number) {
    try {
      await towerService.createTower(towerId, 1);
    } catch (e) {
      log.error(e);
    }
  }

  async staked(from: string, landId: number, towerId: number) {
    try {
      const inGame = await gameService.create(towerId, landId, from);

      let stack: TowerStakingEvent = {
        name: "TowerStakingEvent",
        towerId: inGame.towerId,
        landId: inGame.landId,
        mapId: inGame.mapId,
        from: from,
      };

      this.updateSubject.next(stack);
    } catch (e) {
      log.error(e);
    }
  }

  async unstaked(from: string, landId: number, towerId: number) {
    try {
      const inGame = await gameService.findGameByLandId(landId);

      await gameService.remove(towerId, landId);

      let unstack: TowerUnstakingEvent = {
        name: "TowerUnstakingEvent",
        towerId: towerId,
        landId: landId,
        mapId: inGame.mapId,
      };
      this.updateSubject.next(unstack);
    } catch (e) {
      log.error(e);
    }
  }

  async updateLastBlock(block: number) {
    await eventService.updateLastBlockEvent(block);
  }

  contractUpdatesSubject(): Subject<UpdateEvent> {
    return this.updateSubject;
  }
}

export const contractUpdates = new DefaultSocketProvider();
