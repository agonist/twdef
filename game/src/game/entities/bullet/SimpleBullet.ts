import { Scene } from "phaser";
import { Constants } from "../../Constants";
import { Bullet } from "./Bullet";

export class SimpleBullet extends Bullet {
    constructor(scene: Scene, x: number, y: number){
        super(scene, x, y, Constants.SIMPLE_BULLET)
    }
}