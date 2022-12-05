import { Dispatcher } from "@colyseus/command";
import { Subscription } from "rxjs";
import { NewLandMintedCmd } from "../rooms/commands/NewLandMintedCmd";
import { StartWaveCmd } from "../rooms/commands/StartWaveCmd";
import { GameRoom } from "../rooms/GameRoom";
import { Cellz } from "../rooms/schema/GameState";
import { contractUpdates } from "../web3/DefaultSocketProvider";
import { LandMintedEvent, UpdateEvent } from "../web3/Web3SocketProvider";
import { CanonTower } from "./entity/Tower/CanonTower";
import { Map } from "./Map";
import { BulletRenderer } from "./renderer/BulletRenderer";
import { EnemiesRenderer } from "./renderer/EnemiesRenderer";
import { TowerRenderer } from "./renderer/TowerRenderer";

export const cellSize = 40;

export class GameLogic<R extends GameRoom> {
  room: R;

  enemiesRenderer: EnemiesRenderer;
  towerRenderer: TowerRenderer;
  bulletRenderer: BulletRenderer;
  map: Map;

  subscription: Subscription;
  dispatcher: Dispatcher<R>;

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

    this.dispatcher.dispatch(new StartWaveCmd(this.enemiesRenderer, this.map));

    //     for (let y = 0; y < this.map.height; y += 2) {
    //   for (let x = 0; x < this.map.width; x += 1) {
    //     if (this.map.grid[y][x].t == 4) {
    //       const t1 = new CanonTower(
    //         this.enemiesRenderer,
    //         this.bulletRenderer,
    //         x,
    //         y,
    //         cellSize
    //       );
    //       this.towerRenderer.add(t1);
    //     }
    //   }
    // }
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
  }
}
