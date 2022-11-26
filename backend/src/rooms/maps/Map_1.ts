import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";

export class Map1 extends GameRoom {
  async createMap(): Promise<Map> {
    const m = new Map(1, { x: 25 - 1, y: 15 - 1 });
    await m.loadMap();
    return m;
  }
}
