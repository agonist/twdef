import { Scene } from "phaser";

export abstract class Bullet extends Phaser.GameObjects.Arc {

    constructor(scene: Scene, x: number, y: number, radius: number, fillColor: number) {
        super(scene, x, y, radius, 1, 360, false, fillColor, 1);
        scene.add.existing(this);
    }
}