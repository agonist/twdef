import { Tower } from "../entity/Tower/Tower";
import { EntityRenderer } from "./EntityRenderer";
import { ArraySchema } from "@colyseus/schema";
import { TowerS } from "../../rooms/schema/GameState";

export class TowerRenderer extends EntityRenderer<Tower> {

    towers: ArraySchema<TowerS>

    constructor(towers: ArraySchema<TowerS>) {
        super()
        this.towers = towers
    }

    public add(entity: Tower) {
        this.entities.push(entity);
        this.towers.push(new TowerS({x: entity.x, y: entity.y, t: 0}))
    }


    update(): void {
        this.entities.forEach((tower, i) => {
            // manage destruction

            tower.update()
        })

    }
}