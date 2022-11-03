import { Scene } from "phaser";


export abstract class Tower extends Phaser.GameObjects.Polygon{

    constructor(scene: Scene, x: number, y: number, points: any, fillColor: number) {
        super(scene, x, y, points, fillColor);

        scene.add.existing(this);
    }
}