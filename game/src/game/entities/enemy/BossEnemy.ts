import { Scene } from "phaser"
import { cellSize } from "../../scenes/main-scene"
import { Enemy } from "./Enemy"

export class BossEnemy extends Enemy {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, cellSize / 5 ,0xf0a5ff)
    }
}