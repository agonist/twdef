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
    this.bullets.push(new BulletS({ x: entity.x, y: entity.y }));
    this.entities.push(entity);
  }

  update() {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      this.entities[i].update();
      const bullet = this.entities[i];
      if (bullet.alive) {
        this.bullets[i].x = bullet.x;
        this.bullets[i].y = bullet.y;
      } else {
        this.bullets.splice(i, 1);
        this.entities.splice(i, 1);
      }
    }
  }
}
