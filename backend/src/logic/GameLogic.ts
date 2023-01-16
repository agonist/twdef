import { Dispatcher } from "@colyseus/command";
import { Delayed } from "colyseus";
import { Subscription } from "rxjs";
import { NewLandMintedCmd } from "../rooms/commands/NewLandMintedCmd";
import { RestoreStateCmd } from "../rooms/commands/RestoreStateCmd";
import { StartWaveCmd } from "../rooms/commands/StartWaveCmd";
import { TowerStakingCmd } from "../rooms/commands/TowerStakingComand";
import { TowerUnstakingCmd } from "../rooms/commands/TowerUnstakingComand";
import { GameRoom } from "../rooms/GameRoom";
import { Cellz } from "../rooms/schema/GameState";
import { log } from "../tools/logger";
import { contractUpdates } from "../web3/DefaultSocketProvider";
import {
  LandMintedEvent,
  TowerStakingEvent,
  TowerUnstakingEvent,
  UpdateEvent,
} from "../web3/Web3SocketProvider";
import { Map } from "./Map";
import { BulletRenderer } from "./renderer/BulletRenderer";
import { EnemiesRenderer } from "./renderer/EnemiesRenderer";
import { TowerRenderer } from "./renderer/TowerRenderer";
import { WaveManager } from "./renderer/WaveManager";

export const cellSize = 40;

export class GameLogic<R extends GameRoom> {
  room: R;

  enemiesRenderer: EnemiesRenderer;
  towerRenderer: TowerRenderer;
  bulletRenderer: BulletRenderer;
  waveManager: WaveManager;
  map: Map;

  subscription: Subscription;
  dispatcher: Dispatcher<R>;

  public waveInterval!: Delayed;

  constructor(room: R) {
    this.room = room;
    this.dispatcher = new Dispatcher(room);
  }

  // init everything
  async onCreate(): Promise<void> {
    this.map = await this.createMap();

    this.room.state.world.width = this.map.width;
    this.room.state.world.height = this.map.height;
    this.room.state.world.cellSize = cellSize;

    const c: Cellz[] = [];
    this.map.map.forEach((e) => {
      c.push(new Cellz({ t: e.t, id: e.id, minted: e.minted }));
    });

    this.room.state.world.cells.push(...c);

    this.subscription = contractUpdates.updateSubject.subscribe((update) => {
      this.handleUpdateEvent(update);
    });

    this.enemiesRenderer = new EnemiesRenderer(this.room.state.enemies);
    this.bulletRenderer = new BulletRenderer(this.room.state.bullets);
    this.towerRenderer = new TowerRenderer(this.room.state.towers);
    this.waveManager = new WaveManager();

    this.dispatcher.dispatch(new RestoreStateCmd(), { mapId: this.map.mapId });

    this.room.clock.start();

    this.waveInterval = this.room.clock.setInterval(() => {
      const enemiesR = this.enemiesRenderer.enemies.length;
      const enemiesS = this.room.state.enemies.length;

      const towerR = this.towerRenderer.towers.length;
      const towerS = this.room.state.towers.length;

      const bulletR = this.bulletRenderer.bullets.length;
      const bulletS = this.room.state.bullets.length;
   
      this.dispatcher.dispatch(new StartWaveCmd());
    }, 30000);
    this.dispatcher.dispatch(new StartWaveCmd());

    // this.room.clock.setTimeout(() => {
    //   this.waveInterval.clear();
    // }, 180000);
  }

  update() {
    this.bulletRenderer.update();
    this.enemiesRenderer.update();
    this.towerRenderer.update();
  }

  // events coming from smart contract
  handleUpdateEvent(event: UpdateEvent) {
    switch (event.name) {
      case "LandMintedEvent": {
        this.dispatcher.dispatch(new NewLandMintedCmd(), {
          tokenId: (event as LandMintedEvent).tokenId,
        });
        break;
      }
      case "TowerStakingEvent": {
        const e = event as TowerStakingEvent;
        if (e.mapId != this.map.mapId) {
          return;
        }

        this.dispatcher.dispatch(new TowerStakingCmd(), {
          landId: e.landId,
          towerId: e.towerId,
          owner: e.from,
        });
        break;
      }
      case "TowerUnstakingEvent": {
        const e = event as TowerUnstakingEvent;
        if (e.mapId != this.map.mapId) {
          return;
        }
        this.dispatcher.dispatch(new TowerUnstakingCmd(), {
          landId: e.landId,
          towerId: e.towerId,
        });
        break;
      }
    }
  }

  async createMap(): Promise<Map> {
    const m = new Map(this.room.mapId());
    await m.loadMap();
    return m;
  }

  onDispose() {
    this.dispatcher.stop();
    this.subscription?.unsubscribe();
    this.waveInterval.clear();
  }
}
