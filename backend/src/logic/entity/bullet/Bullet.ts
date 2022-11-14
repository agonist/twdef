import { Enemy } from "../enemy/Enemy";
import { Entity } from "../Entity";
import { Tower } from "../Tower/Tower";

export abstract class Bullet extends Entity {
    public target: Enemy;
    public alive: boolean = true;
    protected emitter: Tower;

    constructor(target: Enemy, emitter: Tower) {
        super(emitter.x, emitter.y, 1); // center
        this.target = target;
        this.emitter = emitter
        console.log("SPAWN BULLET " + this.x + " . " + this.y)

    }

}