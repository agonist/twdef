import { Room, Client } from "colyseus";
import { Cellz, GameState } from "./schema/GameState";
import { Dispatcher } from "@colyseus/command";
import { StartWaveCmd } from "./commands/StartWaveCmd";
import { EnemiesRenderer } from "../logic/renderer/EnemiesRenderer";
import { BulletRenderer } from "../logic/renderer/BulletRenderer";
import { TowerRenderer } from "../logic/renderer/TowerRenderer";
import { CanonTower } from "../logic/entity/Tower/CanonTower";
import { Map } from "../logic/Map";
import { PrismaClient } from "@prisma/client";
import { contractUpdates } from "../web3/AlchemyProvider";
import { Subscription } from "rxjs";

export const cellSize = 40;

export abstract class GameRoom extends Room<GameState> {
  prisma = new PrismaClient();

  dispatcher = new Dispatcher(this);

  enemiesRenderer: EnemiesRenderer;
  towerRenderer: TowerRenderer;
  bulletRenderer: BulletRenderer;
  map: Map;

  subscription: Subscription;

  async onCreate(options: any) {
    this.autoDispose = false;
    this.setState(new GameState());
    this.map = await this.createMap();

    this.subscription = contractUpdates.updateSubject.subscribe((update) => {
      console.log("UPDATE HOHO");
      this.onTokenMinted(update);
    });

    this.state.world.width = this.map.width;
    this.state.world.height = this.map.height;
    this.state.world.cellSize = cellSize;

    const m: Cellz[] = [];
    this.map.map.forEach((e) => {
      m.push(new Cellz({ t: e.t, id: e.id, minted: e.minted }));
    });

    this.state.world.cells.push(...m);

    this.enemiesRenderer = new EnemiesRenderer(this.state.enemies);
    this.bulletRenderer = new BulletRenderer(this.state.bullets);
    this.towerRenderer = new TowerRenderer(this.state.towers);

    // for (let y = 0; y < this.map.height; y+=2) {
    //     for (let x = 0; x < this.map.width; x+=1) {
    //       if (this.map.grid[y][x] > 0) {
    //       const t1 = new CanonTower(this.enemiesRenderer, this.bulletRenderer, x , y, cellSize)
    //       this.towerRenderer.add(t1)
    //       }
    //     }
    //   }

    this.onMessage("type", (client, message) => {});

    this.dispatcher.dispatch(new StartWaveCmd(this.enemiesRenderer, this.map));

    console.log("Game created");

    this.setSimulationInterval((deltaTime) => {
      this.update(deltaTime);
    });
  }

  update(deltaTime: number) {
    this.bulletRenderer.update();
    this.enemiesRenderer.update();
    this.towerRenderer.update();
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.subscription?.unsubscribe();
    this.dispatcher.stop();
  }

  abstract createMap(): Promise<Map>;

  abstract onTokenMinted(tokenId: number): void;
}
