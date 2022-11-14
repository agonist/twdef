import {  Enemy } from "./Enemy";

export class BossEnemy extends Enemy {
    type: number = 4;
    speed: number = 1;
    life: number = 500;
    cash: number = 1.5;
    radius: number = 8;
}
