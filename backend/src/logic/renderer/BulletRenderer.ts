import { Bullet } from "../entity/bullet/Bullet";
import { EntityRenderer } from "./EntityRenderer";
import { ArraySchema } from "@colyseus/schema";
import { BulletS } from "../../rooms/schema/GameState";

export class BulletRenderer extends EntityRenderer<Bullet> {
  bullets: ArraySchema<BulletS>;

  constructor(bullets: ArraySchema<BulletS>) {
    super();
    this.bullets = bullets;
  }

  public add(entity: Bullet) {
    this.bullets.push(new BulletS().assign({ x: entity.x, y: entity.y }));
    this.entities.push(entity);
  }

  update() {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      //   this.entities[i].update();
      const bullet = this.entities[i];
      bullet.update();
      if (bullet.alive) {
        const b = this.bullets[i];
        b.x = bullet.x;
        b.y = bullet.y;
      } else {
        this.bullets.splice(i, 1);
        this.entities.splice(i, 1);
      }
    }
  }
}
