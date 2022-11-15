import {  Enemy } from "./Enemy";

export class SimpleEnemy extends Enemy {
    type: number = 0;
    speed: number = 1;
    life: number = 50000;
    cash: number = 1.5;
    radius: number = 8;
}
