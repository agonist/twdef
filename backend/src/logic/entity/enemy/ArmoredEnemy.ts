import { EnemyCfg } from "../../../rooms/utils/ConfigProvider";
import { Enemy } from "./Enemy";

export class ArmoredEnemy extends Enemy {
  constructor(
    x: number,
    y: number,
    mult: number,
    enemyCfg: EnemyCfg,
    pathUpdate: (i: number, j: number) => any
  ) {
    super(x, y, mult, enemyCfg, pathUpdate);
    this.type = 2;
    this.radius = 8;
  }
}
