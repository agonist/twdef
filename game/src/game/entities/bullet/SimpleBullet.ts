import { Scene } from "phaser";
import { Bullet } from "./Bullet";

export class SimpleBullet extends Bullet{
    constructor(scene: Scene, x: number, y: number){
        super(scene, x, y, 2.5, 0xff0000)
    }
}