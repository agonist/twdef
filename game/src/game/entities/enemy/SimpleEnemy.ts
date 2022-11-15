import { Scene } from "phaser"
import { cellSize } from "../../scenes/main-scene"
import { Enemy } from "./Enemy"

export class SimpleEnemy extends Enemy {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, cellSize / 6, 0xff4f56)
    }
}