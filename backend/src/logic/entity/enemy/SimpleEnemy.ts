import {  Enemy } from "./Enemy";

export class SimpleEnemy extends Enemy {
    type: number = 0;
    speed: number = 2.5;
    life: number = 50 * this.multiplier;
    cash: number = (10 / 0.5) * this.multiplier;
    radius: number = 8;
}
