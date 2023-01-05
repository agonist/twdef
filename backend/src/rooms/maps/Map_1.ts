import { GameRoom } from "../GameRoom";

export class Map1 extends GameRoom {
  landCount(): number {
    return 369;
  }
  mapId(): number {
    return 1;
  }
}
