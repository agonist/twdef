import { Scene, Textures } from "phaser";
import { cellSize } from "../../scenes/main-scene";


export abstract class Tower extends Phaser.GameObjects.Image {

    constructor(scene: Scene, x: number, y: number, key: string, asset: string) {
        super(scene, x, y, key);

        scene.add.existing(this);
    }

    update(){
       const { serverX, serverY } = this.data.values;

       this.x = serverX
       this.y = serverY
    }
}