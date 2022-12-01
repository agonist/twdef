import { Map } from "../../logic/Map";
import { LandMintedEvent } from "../../web3/Web3SocketProvider";
import { GameRoom } from "../GameRoom";
import { Cellz } from "../schema/GameState";

export class Map2 extends GameRoom {
  async createMap(): Promise<Map> {
    const m = new Map(2);

    await m.loadMap();

    return m;
  }

  onTokenMinted(event: LandMintedEvent): void {
    let cell: Cellz;
    this.state.world.cells.forEach((c) => {
      if (c.t == 4) {
        if (c.id == event.tokenId) {
          cell = c;
          cell.minted = true;
        }
      }
    });
  }
}
