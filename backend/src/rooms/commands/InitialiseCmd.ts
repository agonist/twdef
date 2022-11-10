import { Command } from "@colyseus/command";
import { GameRoom } from "../GameRoom";
import { interval } from 'rxjs';
import { mapDef } from "./map";


export class InitialiseCmd extends Command<GameRoom, {}> {

  execute() {
    this.loadWorld()
  }

  loadWorld() {
    this.state.world.width = 100
    this.state.world.height = 100
    this.state.world.cellSize = 10
    this.state.world.cells.push(...mapDef)
  }
}