import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";
import { Cellz } from "../schema/GameState";

export class Map1 extends GameRoom {
  onTokenMinted(tokenId: number): void {
    let cell: Cellz;
    this.state.world.cells.forEach((c) => {
      if (c.t == 4) {
        if (c.id == tokenId) {
          cell = c;
          cell.minted = true;
        }
      }
    });
  }

  async createMap(): Promise<Map> {
    const m = new Map(1);
    await m.loadMap();
    return m;
  }
}
