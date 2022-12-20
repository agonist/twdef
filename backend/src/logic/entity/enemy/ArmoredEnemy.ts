import { Enemy } from "./Enemy";

export class ArmoredEnemy extends Enemy {
  type: number = 2;
  speed: number = 2.5;
  life: number = 150 * this.multiplier;
  cash: number = 1;
  radius: number = 8;
}
