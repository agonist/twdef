import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";

export class Map2 extends GameRoom {

    createMap(): Map {
        return new Map(25, 25, 193, {x: 0, y: 25 - 1})
    }
}