// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.42
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class World extends Schema {
    @type("number") public width!: number;
    @type("number") public height!: number;
    @type("number") public cellSize!: number;
    @type([ "number" ]) public cells: ArraySchema<number> = new ArraySchema<number>();
}
