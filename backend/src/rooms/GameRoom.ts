import { Room, Client } from "colyseus";
import { GameState } from "./schema/GameState";
import { GameLogic } from "../logic/GameLogic";
import { Dispatcher } from "@colyseus/command";
import { TowerRenderer } from "../logic/renderer/TowerRenderer";
import { BulletRenderer } from "../logic/renderer/BulletRenderer";

export abstract class GameRoom extends Room<GameState> {
  game = new GameLogic(this);

  async onCreate(options: any) {
    this.autoDispose = false;
    this.setState(new GameState());
    await this.game.onCreate();

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
