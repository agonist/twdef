import { Enemy } from "./Enemy";

export class FastEnemy extends Enemy {
    type: number = 1;
    speed: number = 2;
    life: number = 200;
    cash: number = 5;
    radius: number = 8;
}