import { Scene } from "phaser"
import { Enemy } from "./Enemy"

export class FastEnemy extends Enemy {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 2.5 ,0x00ff00)
    }
}