import { Scene } from "phaser";

export class RoundTower extends  Phaser.GameObjects.Arc {
    constructor(scene: Scene, x: number, y: number, radius: number, fillColor: number, fillAlpha: number) {
        super(scene, x, y, radius, 0, 360, false, fillColor, fillAlpha);

        scene.add.existing(this);
    }
}