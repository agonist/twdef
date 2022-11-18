import { Scene } from "phaser"
import { Constants } from "../../Constants"
import { cellSize } from "../../scenes/main-scene"
import { Enemy } from "./Enemy"

export class FastEnemy extends Enemy {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, Constants.FAST_ENEMY )
    }
}