import { Enemy } from "./Enemy";

export class ArmoredEnemy extends Enemy {
    type: number = 2;
    speed: number = 2;
    life: number = 500;
    cash: number = 10;
    radius: number = 8;
}