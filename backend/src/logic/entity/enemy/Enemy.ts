import { Point } from "../../../tools/Point";
import { map } from "../../Map";
import { Entity } from "../Entity";

export abstract class Enemy extends Entity {
    abstract speed: number;
    abstract life: number;
    abstract cash: number;
    abstract radius: number;
    abstract type: number;
    protected damage: number = 10;
    public alive = true;
    damageTaken: number = 0;

    private path: Point[] | false = false;
    private targetIndex: number = 1;


    constructor(x: number, y: number){
        super(x, y)
        this.updatePath();
    }

    updatePath() {
        this.path = this.getPath()
        this.targetIndex = 1
    }

    update(){
        if (this.path) {
            const target = this.path[this.targetIndex];
                if (target) {
                const angle = Math.atan2(target.y - this.y, target.x - this.x);
                const nearEqualX = this.x >= target.x - this.speed && this.x <= target.x + this.speed;
                const nearEqualY = this.y >= target.y - this.speed && this.y <= target.y + this.speed;

                if (!nearEqualX) {
                    this.x += Math.cos(angle) * this.speed;
                } else {
                    this.x = target.x
                }

                if (!nearEqualY) {
                    this.y += Math.sin(angle) * this.speed;
                } else {
                    this.y = target.y
                }

                if (nearEqualX && nearEqualY) {
                    this.targetIndex++;
                }
            } else {
                //map.homeBase.handleDamage();
                this.alive = false;
            }
        }
    }

     takeDamage(damage: number) {
        this.damageTaken += damage;

        if (this.damageTaken >= this.life && this.alive) {
            this.alive = false;
            this.onDie();
        }
    }

      private onDie() {
        // cashManager.add(this.cash);
    }


     public getPath() {
        return map.getPathFromGridCell(
            Math.floor(this.x / 10),
            Math.floor(this.y / 10)
        )
    }

}