import { Room, Client } from "colyseus";
import e from "express";
import { Enemy, GameState, Wave } from "./schema/GameState";
import { Dispatcher } from "@colyseus/command";
import { InitialiseCmd } from "./commands/InitialiseCmd";
import { StartWaveCmd } from "./commands/StartWaveCmd";
import { EnemiesRenderer } from "../logic/renderer/EnemiesRenderer";

export class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);

  enemiesRenderer: EnemiesRenderer

  onCreate (options: any) {
    this.setState(new GameState());
    this.enemiesRenderer = new EnemiesRenderer(this.state.enemies)

    this.onMessage("type", (client, message) => {});

    this.dispatcher.dispatch(new InitialiseCmd())
    this.dispatcher.dispatch(new StartWaveCmd(this.enemiesRenderer))

    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  update (deltaTime: number) {
    this.enemiesRenderer.update()
}

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.dispatcher.stop();
  }

}
