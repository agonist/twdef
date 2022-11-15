import { Enemy } from "./Enemy";

export class FastEnemy extends Enemy {
    type: number = 1;
    speed: number = 2.5;
    life: number = 20000;
    cash: number = 5;
    radius: number = 8;
}