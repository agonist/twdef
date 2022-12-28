import { Enemy } from "./Enemy";

export class ArmoredEnemy extends Enemy {
  type: number = 2;
  speed: number = 2.5;
  life: number = 150 * this.multiplier;
  cash: number = (10 / 0.3) * this.multiplier;
  radius: number = 8;
}
