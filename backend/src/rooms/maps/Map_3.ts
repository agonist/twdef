import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";

export class Map3 extends GameRoom {
  async createMap(): Promise<Map> {
    const m = new Map(3, { x: 15 - 1, y: 15 - 1 });
    await m.loadMap();
    return m;
  }
}
