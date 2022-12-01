import { Room, Client } from "colyseus";
import { GameState } from "./schema/GameState";
import { GameLogic } from "../logic/GameLogic";
import { Dispatcher } from "@colyseus/command";

export abstract class GameRoom extends Room<GameState> {
  game = new GameLogic(this);

  async onCreate(options: any) {
    this.autoDispose = false;
    this.setState(new GameState());
    await this.game.onCreate();

    // for (let y = 0; y < this.map.height; y+=2) {
    //     for (let x = 0; x < this.map.width; x+=1) {
    //       if (this.map.grid[y][x] > 0) {
    //       const t1 = new CanonTower(this.enemiesRenderer, this.bulletRenderer, x , y, cellSize)
    //       this.towerRenderer.add(t1)
    //       }
    //     }
    //   }
    console.log("Game created");

    this.setSimulationInterval((deltaTime) => {
      this.update(deltaTime);
    });
  }

  update(deltaTime: number) {
    this.game.update();
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.game.onDispose();
  }

  abstract mapId(): number;
}
