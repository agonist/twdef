import {  Enemy } from "./Enemy";

export class BossEnemy extends Enemy {
    type: number = 4;
    speed: number = 2.5;
    life: number = 200 * this.multiplier;
    cash: number = 5;
    radius: number = 8;
}
