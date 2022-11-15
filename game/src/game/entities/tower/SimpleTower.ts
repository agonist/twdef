import { Scene } from "phaser";
import { Tower } from "./Tower";

export class SimpleTower extends Tower {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 3.5 , 0x4b77fb)
        this.setStrokeStyle(5, 0x648afc, 1);
    }

}