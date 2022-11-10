import { Enemy } from "../entity/enemy/Enemy";
import { EntityRenderer } from "./EntityRenderer";
import { ArraySchema } from "@colyseus/schema";
import { EnemyS } from "../../rooms/schema/GameState";

export class EnemiesRenderer extends EntityRenderer<Enemy> {

    enemies: ArraySchema<EnemyS>


    constructor(enemies: ArraySchema<EnemyS>) {
        super()
        this.enemies = enemies
    }

    public add(entity: Enemy) {
        this.entities.push(entity);
        this.enemies.push(new EnemyS({x: entity.x, y: entity.y, t: entity.type}))
    }

    update() {
        this.entities.forEach((enemy, i) =>{
            if (enemy.alive) {
                enemy.update();
            } else {
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