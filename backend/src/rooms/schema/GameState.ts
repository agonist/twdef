import { Schema, Context, type,ArraySchema } from "@colyseus/schema";

export class Enemy extends Schema {
    @type("number") x: number;
    @type("number") y: number;
}

export class Wave extends Schema {
    @type([ Enemy ]) enemies = new ArraySchema<Enemy>();
}

class World extends Schema {
   // in cells
    @type("number") width: number;
    @type("number") height: number;
    // in pixels, so a 10 x 10 map would be 100 x 100
    @type("number") cellSize: number = 10;
    @type( [ "number" ] ) cells = new ArraySchema<number>();


}

export class GameState extends Schema {

    @type(World) world: World = new World()

    @type([ Enemy ]) enemies = new ArraySchema<Enemy>();


}
