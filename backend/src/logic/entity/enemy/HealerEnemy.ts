import {  Enemy } from "./Enemy";

export class HealerEnemy extends Enemy {
    type: number = 3;
    speed: number = 1;
    life: number = 50;
    cash: number = 1.5;
    radius: number = 8;
}
