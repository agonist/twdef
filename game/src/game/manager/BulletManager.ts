import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { Bullet } from "../entities/bullet/Bullet";
import { SimpleBullet } from "../entities/bullet/SimpleBullet";

export class BulletManager {
    bullets: Bullet[] = []

    constructor(){}

    init(room: Room<GameState>, scene: Scene){
        room.state.bullets.onAdd = (bullet, key)=> {
            let entity: Bullet

            entity = new SimpleBullet(scene, bullet.x, bullet.y)

            console.log(entity)
            this.bullets.push(entity)

            bullet.onChange = () => {
                entity.setData("serverX", bullet.x);
                entity.setData("serverY", bullet.y);  
            }

            bullet.onRemove = () => {
                entity.destroy()
            }
        }
    }

  update() {
    this.bullets.forEach((bullet) => {
        if (bullet.data !== undefined) {
            const { serverX, serverY } = bullet?.data?.values;

            bullet.x = Phaser.Math.Linear(bullet.x, serverX, 0.1);
            bullet.y = Phaser.Math.Linear(bullet.y, serverY, 0.1);
        }


    });
  }
}