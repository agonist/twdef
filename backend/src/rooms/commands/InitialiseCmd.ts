import { Command } from "@colyseus/command";
import { cellSize, GameRoom } from "../GameRoom";
import { map, Map } from "../../logic/Map";

export class InitialiseCmd extends Command<GameRoom, {}> {

  constructor() {
    super()
  }

  execute() {
    this.loadWorld()
  }

  loadWorld() {
    this.state.world.width = 100
    this.state.world.height = 100
    this.state.world.cellSize = cellSize
    this.state.world.cells.push(...map.map)
  }
}