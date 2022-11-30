import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";
import { Cellz } from "../schema/GameState";

export class Map2 extends GameRoom {
  async createMap(): Promise<Map> {
    const m = new Map(2);

    await m.loadMap();

    return m;
  }

  onTokenMinted(tokenId: number): void {
    const c: Cellz = this.state.world.cells.find(
      (c) => c.t === 4 && c.id === tokenId
    );
    if (c !== undefined) {
      c.minted = true;
    }
  }
}
