import { Enemy } from "./Enemy";

export class BossEnemy extends Enemy {
  type: number = 4;
  speed: number = 2.5;
  life: number = 200 * this.multiplier;
  cash: number = (10 / 0.01) * this.multiplier;
  radius: number = 8;
}
