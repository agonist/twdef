import { EnemyCfg } from "../../../rooms/commands/StartWaveCmd";
import { Enemy } from "./Enemy";

export class FastEnemy extends Enemy {
  constructor(
    x: number,
    y: number,
    mult: number,
    enemyCfg: EnemyCfg,
    pathUpdate: (i: number, j: number) => any
  ) {
    super(x, y, mult, enemyCfg, pathUpdate);
    this.type = 1;
    this.radius = 8;
  }
}
