import { Tower } from "../entity/Tower/Tower";
import { EntityRenderer } from "./EntityRenderer";
import { ArraySchema } from "@colyseus/schema";
import { TowerS } from "../../rooms/schema/GameState";

export class TowerRenderer extends EntityRenderer<Tower> {
  towers: ArraySchema<TowerS>;

  constructor(towers: ArraySchema<TowerS>) {
    super();
    this.towers = towers;
  }

  // type - 0 = fire , 1 = ice , 2 = jungle
  public add(entity: Tower) {
    this.entities.push(entity);

    this.towers.push(
      new TowerS().assign({
        x: entity.x,
        y: entity.y,
        t: entity.type,
        id: entity.id,
      })
    );
  }

  public remove(towerId: number) {
    const index = this.entities.findIndex((object) => {
      return object.id === towerId;
    });
    if (index !== -1) {
      this.entities.splice(index, 1);
    }

    const index2 = this.towers.findIndex((object: TowerS) => {
      return object.id === towerId;
    });
    if (index2 !== -1) {
      this.towers.splice(index2, 1);
    }
  }

  update(): void {
    this.entities.forEach((tower, i) => {
      // manage destruction
      tower.update();
    });
  }
}
