import { Command } from "@colyseus/command";
import { Room } from "colyseus";
import { gameService } from "../../db/GamezService";
import { CanonTower } from "../../logic/entity/Tower/CanonTower";
import { cellSize } from "../../logic/GameLogic";
import { GameRoom } from "../GameRoom";

export class RestoreStateCmd extends Command<GameRoom, { mapId: number }> {
  async execute({ mapId } = this.payload) {
    const games = await gameService.findGameByMapId(mapId);
    games.forEach((g) => {
      const t1 = new CanonTower(
        this.room.game.enemiesRenderer,
        this.room.game.bulletRenderer,
        g.x,
        g.y,
        cellSize,
        g.towerId
      );

      this.room.game.towerRenderer.add(t1);
    });
  }
}
