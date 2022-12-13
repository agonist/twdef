import { Command } from "@colyseus/command";
import { log } from "../../tools/logger";
import { GameRoom } from "../GameRoom";

export class TowerUnstakingCmd extends Command<
  GameRoom,
  { landId: number; towerId: number }
> {
  async execute({ landId, towerId } = this.payload) {
    log.info("Exec TowerUnstakingCmd land#" + landId + " tower#" + towerId);
    const towerRender = this.room.game.towerRenderer;

    towerRender.remove(towerId);
    log.info("Tower removed land#" + landId + " tower#" + towerId);
  }
}
