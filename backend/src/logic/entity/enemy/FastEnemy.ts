import { Enemy } from "./Enemy";

export class FastEnemy extends Enemy {
  type: number = 1;
  speed: number = 3;
  life: number = 100 * this.multiplier;
  cash: number = (10 / 0.3) * this.multiplier;
  radius: number = 8;
}