import { Room, Client } from "colyseus";
import { GameState } from "./schema/GameState";
import { GameLogic } from "../logic/GameLogic";
import { log } from "../tools/logger";

export abstract class GameRoom extends Room<GameState> {
  game = new GameLogic(this);

  async onCreate(options: any) {
    this.autoDispose = false;
    this.setState(new GameState());
    await this.game.onCreate();

    log.info("Game created");

    this.setSimulationInterval((deltaTime) => {
      this.update(deltaTime);
    });
  }

  update(deltaTime: number) {
    this.game.update();
  }

  onJoin(client: Client, options: any) {
    log.info(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    log.info(client.sessionId, "left!");
  }

  onDispose() {
    log.info("room", this.roomId, "disposing...");
    this.game.onDispose();
  }

  abstract mapId(): number;
}
