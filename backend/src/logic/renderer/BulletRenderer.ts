import { Bullet } from "../entity/bullet/Bullet";
import { EntityRenderer } from "./EntityRenderer";
import { ArraySchema } from "@colyseus/schema";
import { BulletS } from "../../rooms/schema/GameState";

export class BulletRenderer extends EntityRenderer<Bullet> {

    bullets: ArraySchema<BulletS>

    constructor(bullets: ArraySchema<BulletS>) {
        super()
        this.bullets = bullets
    }

    public add(entity: Bullet) {
        this.entities.push(entity);
        this.bullets.push(new BulletS({x: entity.x, y: entity.y}))
    }

    update() {
        super.update();

        this.entities.forEach((bullet, i) =>{
            if (bullet.alive) {
                bullet.update();
            } else {
                this.bullets.splice(i, 1)
                this.entities.splice(i, 1);
            }
        })

         this.entities.forEach((bullet, i) => {
            this.bullets[i].x = bullet.x
            this.bullets[i].y = bullet.y
        })
    }
}
