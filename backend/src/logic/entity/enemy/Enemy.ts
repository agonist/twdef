import { Entity } from "../Entity";

export abstract class Enemy extends Entity {
    abstract speed: number;
    abstract life: number;
    abstract cash: number;
    abstract radius: number;
    abstract type: number;
    protected damage: number = 10;
    public alive = true;

    constructor(x: number, y: number){
        super(x, y)
    }

    update(){
        if (this.x === 1000) {
            this.x = 1
            this.y += 10
        }

        this.x += 1
    }

}