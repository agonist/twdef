import { Room, Client } from "colyseus";
import e from "express";
import {  GameState } from "./schema/GameState";
import { Dispatcher } from "@colyseus/command";
import { InitialiseCmd } from "./commands/InitialiseCmd";
import { StartWaveCmd } from "./commands/StartWaveCmd";
import { EnemiesRenderer } from "../logic/renderer/EnemiesRenderer";
import { BulletRenderer } from "../logic/renderer/BulletRenderer";
import { TowerRenderer } from "../logic/renderer/TowerRenderer";
import { CanonTower } from "../logic/entity/Tower/CanonTower";

export class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);

  enemiesRenderer: EnemiesRenderer
  towerRenderer: TowerRenderer
  bulletRenderer: BulletRenderer
  // map: Map

  onCreate (options: any) {
    this.autoDispose = false
    this.setState(new GameState());

    // this.map = new Map()

    this.enemiesRenderer = new EnemiesRenderer(this.state.enemies)
    this.bulletRenderer = new BulletRenderer(this.state.bullets)
    this.towerRenderer = new TowerRenderer(this.state.towers)

    // for (let i = 1; i < 50; i++) {
    //   const t1 = new CanonTower(this.enemiesRenderer, this.bulletRenderer, i, i * 2, 10)
    //   this.towerRenderer.add(t1)
    // }

    const t1 = new CanonTower(this.enemiesRenderer, this.bulletRenderer, 10, 2, 10)

    this.towerRenderer.add(t1)

    this.onMessage("type", (client, message) => {});

    this.dispatcher.dispatch(new InitialiseCmd())
    this.dispatcher.dispatch(new StartWaveCmd(this.enemiesRenderer))

    console.log("Game created")

    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  update (deltaTime: number) {
    this.enemiesRenderer.update()
    this.towerRenderer.update()
    this.bulletRenderer.update()
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
