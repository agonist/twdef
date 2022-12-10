import { Command } from "@colyseus/command";
import { Room } from "colyseus";
import { landService } from "../../db/LandService";
import { CanonTower } from "../../logic/entity/Tower/CanonTower";
import { cellSize } from "../../logic/GameLogic";
import { GameRoom } from "../GameRoom";

export class TowerStakingCmd extends Command<
  GameRoom,
  { landId: number; towerId: number }
> {
  async execute({ landId, towerId } = this.payload) {
    const towerRender = this.room.game.towerRenderer;
    const bulletRenderer = this.room.game.bulletRenderer;
    const enemiesRenderer = this.room.game.enemiesRenderer;

    const land = await landService.findLandByIdwithCell(landId);

    const t1 = new CanonTower(
      enemiesRenderer,
      bulletRenderer,
      land.Cell.x,
      land.Cell.y,
      cellSize
    );

    towerRender.add(t1);
  }
}
