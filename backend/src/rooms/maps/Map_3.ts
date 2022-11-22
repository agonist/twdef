import { Map } from "../../logic/Map";
import { GameRoom } from "../GameRoom";

export class Map3 extends GameRoom {

    createMap(): Map {
        return new Map(15, 15, 506, {x: 15 - 1, y: 15 - 1})
    }
}