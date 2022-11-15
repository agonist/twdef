import { Scene } from "phaser"
import { cellSize } from "../../scenes/main-scene"
import { Enemy } from "./Enemy"

export class FastEnemy extends Enemy {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, cellSize / 6 , 0xff7d83)
    }
}