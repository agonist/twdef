import { Command } from "@colyseus/command";
import { Room } from "colyseus";
import { GameRoom } from "../GameRoom";
import { Cellz } from "../schema/GameState";

export class NewLandMintedCmd extends Command<GameRoom, { tokenId: number }> {
  execute({ tokenId } = this.payload) {
    this.state.world.cells.forEach((c) => {
      if (c.t == 4) {
        if (c.id == tokenId) {
          c.minted = true;
        }
      }
    });
  }
}
