import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { log } from "../helpers/logger";
import { gameState } from "../state/game-state";

export class WaveManager {
  init(room: Room<GameState>, scene: Scene) {
    room.state.wave.listen("count", (currentValue, previousValue) => {
      gameState.getState().setWave(currentValue);
    });
    room.state.wave.listen("multiplier", (currentValue, previousValue) => {
      gameState.getState().setMultiplier(currentValue);
    });
  }
}
