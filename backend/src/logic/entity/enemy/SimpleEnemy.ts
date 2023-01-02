import { EnemyCfg } from "../../../rooms/commands/StartWaveCmd";
import { cellSize } from "../../GameLogic";
import { Enemy } from "./Enemy";

export class SimpleEnemy extends Enemy {
  constructor(
    x: number,
    y: number,
    mult: number,
    enemyCfg: EnemyCfg,
    pathUpdate: (i: number, j: number) => any
  ) {
    super(x, y, mult, enemyCfg, pathUpdate);
    this.type = 0;
    this.radius = 8;
  }
}
