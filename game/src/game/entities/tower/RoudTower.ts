import { Scene } from "phaser";
import { Tower } from "./Tower";

export class RoundTower extends  Tower {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "5", "")
    }
}