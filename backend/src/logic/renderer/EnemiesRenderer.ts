import { Enemy } from "../entity/enemy/Enemy";
import { EntityRenderer } from "./EntityRenderer";
import { ArraySchema } from "@colyseus/schema";
import { EnemyS } from "../../rooms/schema/GameState";
import { euclideanDistanceSquared } from "../../tools/helpers";

export class EnemiesRenderer extends EntityRenderer<Enemy> {

    enemies: ArraySchema<EnemyS>

    constructor(enemies: ArraySchema<EnemyS>) {
        super()
        this.enemies = enemies
    }

    public add(entity: Enemy) {
        this.enemies.push(new EnemyS({x: entity.x, y: entity.y, t: entity.type}))
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

        return closestEnemy
    }

    getAllInRadius(x: number, y: number, radius: number) {
        const distanceSquared = radius * radius;
        return this.entities.filter(e => euclideanDistanceSquared(e.x, e.y, x, y) <= distanceSquared);
    }

    update() {
        this.entities.forEach((enemy, i) =>{
            if (enemy.alive) {
                enemy.update();
            } else {
                this.enemies.splice(i, 1)
                this.entities.splice(i, 1);
            }
        })

        // for now its some kind of double loop.
        // lets see to make it into one later
        this.entities.forEach((enemy, i) => {
            this.enemies[i].x = enemy.x
            this.enemies[i].y = enemy.y
        })
    }
}