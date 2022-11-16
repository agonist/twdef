import { Enemy } from "./Enemy";

export class FastEnemy extends Enemy {
    type: number = 1;
    speed: number = 4;
    life: number = 200 * this.multiplier;
    cash: number = 5;
    radius: number = 8;
}