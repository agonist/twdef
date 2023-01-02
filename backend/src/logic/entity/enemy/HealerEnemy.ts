import { EnemyCfg } from "../../../rooms/utils/ConfigProvider";
import { Enemy } from "./Enemy";

export class HealerEnemy extends Enemy {
  constructor(
    x: number,
    y: number,
    mult: number,
    enemyCfg: EnemyCfg,
    pathUpdate: (i: number, j: number) => any
  ) {
    super(x, y, mult, enemyCfg, pathUpdate);
    this.type = 3;
    this.radius = 8;
  }
}
