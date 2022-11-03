import { Scene } from "phaser";
import { Tower } from "./Tower";

export class SimpleTower extends Tower {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, [x + 5, y, x + 10, y + 5, x + 5, y + 10, x, y + 5], 0xff0000)
    }

}