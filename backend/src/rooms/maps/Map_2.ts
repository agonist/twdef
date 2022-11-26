import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";

export class Map2 extends GameRoom {
  async createMap(): Promise<Map> {
    const m = new Map(2, { x: 0, y: 25 - 1 });

    await m.loadMap();

    return m;
  }
}
