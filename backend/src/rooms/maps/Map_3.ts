import { Map } from "../../logic/Map";
import { LandMintedEvent } from "../../web3/Web3SocketProvider";
import { GameRoom } from "../GameRoom";
import { Cellz } from "../schema/GameState";

export class Map3 extends GameRoom {
  mapId(): number {
    return 3;
  }
}
