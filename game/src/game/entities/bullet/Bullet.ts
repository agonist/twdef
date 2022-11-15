import { Scene } from "phaser";
import { cellSize } from "../../scenes/main-scene";

export abstract class Bullet extends Phaser.GameObjects.Arc {

    constructor(scene: Scene, x: number, y: number, radius: number, fillColor: number) {
        super(scene, x, y, 4 , 0, 360, false, fillColor, 1);
        scene.add.existing(this);
    }

    update(){
       const { serverX, serverY } = this.data.values;

       this.x = Phaser.Math.Linear(this.x, serverX, 1);
       this.y = Phaser.Math.Linear(this.y, serverY, 1);
    }
}