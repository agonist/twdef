import { Scene } from "phaser";
import { Tower } from "./Tower";

export class SimpleTower extends Tower {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 3.5 , 0xff0000)
    }

}