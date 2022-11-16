import { Scene } from "phaser";
import { cellSize } from "../../scenes/main-scene";


export abstract class Tower extends Phaser.GameObjects.Arc {

    constructor(scene: Scene, x: number, y: number, radius: number, fillColor: number) {
        super(scene, x, y, (cellSize / 2) - 5, 0, 360, false, fillColor, 1);

        scene.add.existing(this);
    }

    update(){
        const { serverX, serverY } = this.data.values;

       this.x = serverX
       this.y = serverY
    }
}