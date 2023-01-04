import { Room, Client } from "colyseus";
import { GameState } from "./schema/GameState";
import { GameLogic } from "../logic/GameLogic";
import { log } from "../tools/logger";

export abstract class GameRoom extends Room<GameState> {
  game = new GameLogic(this);
  fixedTimeStep = 1000 / 60;

  async onCreate(options: any) {
    this.autoDispose = false;
    this.setState(new GameState());
    await this.game.onCreate();

    log.info("Game created");

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;
      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.update(deltaTime);
      }
    });
  }

  update(deltaTime: number) {
    this.game.update();
    this.state.assign
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
