import { Scene } from "phaser";
import { cellSize } from "../../scenes/main-scene";

export abstract class Bullet extends Phaser.GameObjects.Image {

    constructor(scene: Scene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        scene.add.existing(this);
    }

    update(){
       const { serverX, serverY } = this.data.values;

       this.x = Phaser.Math.Linear(this.x, serverX, 1);
       this.y = Phaser.Math.Linear(this.y, serverY, 1);
    }
}