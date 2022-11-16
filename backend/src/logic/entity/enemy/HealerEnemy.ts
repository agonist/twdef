import {  Enemy } from "./Enemy";

export class HealerEnemy extends Enemy {
    type: number = 3;
    speed: number = 2.5;
    life: number = 50 * this.multiplier;
    cash: number = 1.5;
    radius: number = 8;
}
