import { Command } from "@colyseus/command";
import { cellSize, GameRoom } from "../GameRoom";
import { map, Map, MAP_HEIGHT, MAP_WIDTH } from "../../logic/Map";

export class InitialiseCmd extends Command<GameRoom, {}> {

  constructor() {
    super()
  }

  execute() {
    this.loadWorld()
  }

  loadWorld() {
    this.state.world.width = MAP_WIDTH
    this.state.world.height = MAP_HEIGHT
    this.state.world.cellSize = cellSize
    this.state.world.cells.push(...map.map)
  }
}