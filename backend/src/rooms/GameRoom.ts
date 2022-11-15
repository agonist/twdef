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

export const cellSize = 40

export class GameRoom extends Room<GameState> {
  dispatcher = new Dispatcher(this);

  enemiesRenderer: EnemiesRenderer
  towerRenderer: TowerRenderer
  bulletRenderer: BulletRenderer
  // map: Map
  fixedTimeStep = 1000 / 60;
  
  onCreate (options: any) {
    this.autoDispose = false
    this.setState(new GameState());

    // this.map = new Map()

    this.enemiesRenderer = new EnemiesRenderer(this.state.enemies)
    this.bulletRenderer = new BulletRenderer(this.state.bullets)
    this.towerRenderer = new TowerRenderer(this.state.towers)

  for (let y = 0; y < 100; y+=4) {
      for (let x = 5; x < 100; x+=5) {
        const t1 = new CanonTower(this.enemiesRenderer, this.bulletRenderer, x , y, cellSize)
        this.towerRenderer.add(t1)
      }
    }

    this.onMessage("type", (client, message) => {});

    this.dispatcher.dispatch(new InitialiseCmd())
    this.dispatcher.dispatch(new StartWaveCmd(this.enemiesRenderer))

    console.log("Game created")

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {this.update(1)})
    // this.setSimulationInterval((deltaTime) => {
    //     elapsedTime += deltaTime;

    //     while (elapsedTime >= this.fixedTimeStep) {
    //         elapsedTime -= this.fixedTimeStep;
    //         this.fixedTick(this.fixedTimeStep);
    //     }
    // });
  }

  fixedTick(deltaTime: number){
      this.update(deltaTime)
  }

  update (deltaTime: number) {
    this.bulletRenderer.update()
    this.enemiesRenderer.update()
    this.towerRenderer.update()
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
