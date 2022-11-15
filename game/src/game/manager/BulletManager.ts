import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { Bullet } from "../entities/bullet/Bullet";
import { SimpleBullet } from "../entities/bullet/SimpleBullet";

export class BulletManager {

    simpleBulletGroup?: Phaser.GameObjects.Group

    constructor(){}

    init(room: Room<GameState>, scene: Scene){
    this.simpleBulletGroup = scene.add.group({
        classType: SimpleBullet,
        runChildUpdate: true
    });

        room.state.bullets.onAdd = (bullet, key)=> {
            let entity: Bullet

            entity = this.simpleBulletGroup?.get(bullet.x, bullet.y)
            entity.visible = true
            entity.active = true

            bullet.onChange = () => {
                console.log(bullet.x + " " + bullet.y)
                entity.setData("serverX", bullet.x);
                entity.setData("serverY", bullet.y);
            }

            bullet.onRemove = () => {
                this.simpleBulletGroup?.killAndHide(entity)
            }
        }
    }
}