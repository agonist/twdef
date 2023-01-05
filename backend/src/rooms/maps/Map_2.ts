import { GameRoom } from "../GameRoom";

export class Map2 extends GameRoom {
  mapId(): number {
    return 2;
  }
  landCount(): number {
    return 369;
  }
}
