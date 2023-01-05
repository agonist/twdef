import { GameRoom } from "../GameRoom";

export class Map3 extends GameRoom {
  mapId(): number {
    return 3;
  }
  landCount(): number {
    return 369;
  }
}
