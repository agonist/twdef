import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { log } from "../helpers/logger";

export class WaveManager {
  init(room: Room<GameState>, scene: Scene) {
    room.state.wave.listen("count", (currentValue, previousValue) => {
      log.info(`count is now ${currentValue}`);
      log.info(`previous value was: ${previousValue}`);
    });
    room.state.wave.listen("multiplier", (currentValue, previousValue) => {
      log.info(`multiplier is now ${currentValue}`);
      log.info(`previous value was: ${previousValue}`);
    });
  }
}
