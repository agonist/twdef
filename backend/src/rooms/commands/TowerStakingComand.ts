import { Command } from "@colyseus/command";
import { Room } from "colyseus";
import gameService from "../../db/GamezService";
import landService from "../../db/LandService";
import towerService from "../../db/TowerService";
import { CanonTower } from "../../logic/entity/Tower/CanonTower";
import { cellSize } from "../../logic/GameLogic";
import { getTowerType } from "../../tools/helpers";
import { log } from "../../tools/logger";
import { GameRoom } from "../GameRoom";

export class TowerStakingCmd extends Command<
  GameRoom,
  { landId: number; towerId: number; owner: string }
> {
  async execute({ landId, towerId, owner } = this.payload) {
    log.info("Exec TowerStakingCmd land#" + landId + " tower#" + towerId);

    const towerRender = this.room.game.towerRenderer;
    const bulletRenderer = this.room.game.bulletRenderer;
    const enemiesRenderer = this.room.game.enemiesRenderer;

    const land = await landService.findLandByIdwithCell(landId);
    const tower = await towerService.findTowerById(towerId);

    const towerDamage = land.damageBonus + tower.damage;

    const t1 = new CanonTower(
      enemiesRenderer,
      bulletRenderer,
      land.Cell.x,
      land.Cell.y,
      cellSize,
      towerId,
      owner,
      towerDamage,
      getTowerType(tower.type)
    );

    towerRender.add(t1);
    log.info("Tower added in game land#" + landId + " tower#" + towerId);
  }
}
