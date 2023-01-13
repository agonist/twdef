import { Command } from "@colyseus/command";
import gameService  from "../../db/GamezService";
import { CanonTower } from "../../logic/entity/Tower/CanonTower";
import { cellSize } from "../../logic/GameLogic";
import { getTowerType } from "../../tools/helpers";
import { GameRoom } from "../GameRoom";

export class RestoreStateCmd extends Command<GameRoom, { mapId: number }> {
  async execute({ mapId } = this.payload) {
    const games = await gameService.findGameByMapId(mapId);
    games.forEach((g) => {
      const dmg = g.land.damageBonus + g.tower.damage;

      const t1 = new CanonTower(
        this.room.game.enemiesRenderer,
        this.room.game.bulletRenderer,
        g.x,
        g.y,
        cellSize,
        g.towerId,
        g.owner,
        dmg,
        getTowerType(g.tower.type)
      );

      this.room.game.towerRenderer.add(t1);
    });
  }
}
