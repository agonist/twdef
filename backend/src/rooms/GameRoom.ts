import { Room, Client } from "colyseus";
import e from "express";
import { Enemy, GameState, Wave } from "./schema/GameState";
import { Dispatcher } from "@colyseus/command";
import { InitialiseCmd } from "./commands/InitialiseCmd";

export class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);

  onCreate (options: any) {
    this.setState(new GameState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
    this.dispatcher.dispatch(new InitialiseCmd())

    const e1 = new Enemy()
    e1.x = 10
    e1.y = 10

const e2 = new Enemy()
    e2.x = 20
    e2.y = 10

    const e3 = new Enemy()
    e3.x = 30
    e3.y = 10

    this.state.enemies.push(e1)
    this.state.enemies.push(e2)
    this.state.enemies.push(e3)

    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  update (deltaTime: number) {
    // implement your physics or world updates here!
    // this is a good place to update the room state
    this.state.enemies.forEach(e => {
      if (e.x === 200) e.x = 0
      e.x += 1
    })
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
