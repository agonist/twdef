import { Enemy } from "../entity/enemy/Enemy";
import { EntityRenderer } from "./EntityRenderer";
import { ArraySchema } from "@colyseus/schema";
import { EnemyS } from "../../rooms/schema/GameState";
import { euclideanDistanceSquared } from "../../tools/helpers";

export class EnemiesRenderer extends EntityRenderer<Enemy> {
  enemies: ArraySchema<EnemyS>;

  constructor(enemies: ArraySchema<EnemyS>) {
    super();
    this.enemies = enemies;
  }

  public add(entity: Enemy) {
    this.enemies.push(
      new EnemyS().assign({ x: entity.x, y: entity.y, t: entity.type })
    );
    this.entities.push(entity);
  }

  getClosestPointInRadius(x: number, y: number, radius: number) {
    let closestEnemy;
    let shortestDistanceSquared = radius * radius;

    for (let i = 0; i < this.entities.length; ++i) {
      const enemy = this.entities[i];

      const distanceSquared = euclideanDistanceSquared(enemy.x, enemy.y, x, y);

      if (distanceSquared <= shortestDistanceSquared) {
        shortestDistanceSquared = distanceSquared;
        closestEnemy = enemy;
      }
    }

    return closestEnemy;
  }

  update() {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      //   this.entities[i].update();
      const enemy = this.entities[i];
      enemy.update();
      if (enemy.alive) {
        const e = this.enemies[i];
        e.x = enemy.x;
        e.y = enemy.y;
      } else {
        this.enemies.splice(i, 1);
        this.entities.splice(i, 1);
      }
    }
  }
}
