import { Scene } from "phaser"
import { Enemy } from "./Enemy"

export class BossEnemy extends Enemy {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 2.5 ,0xf0a5ff)
    }
}