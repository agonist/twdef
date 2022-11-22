import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";

export class Map1 extends GameRoom {

    createMap(): Map {
        return new Map(25, 15, 1, {x: 25 - 1, y: 15 - 1})
    }
}