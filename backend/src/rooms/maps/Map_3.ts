import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";

export class Map3 extends GameRoom {
  async createMap(): Promise<Map> {
    const m = new Map(3);
    await m.loadMap();
    return m;
  }
}
