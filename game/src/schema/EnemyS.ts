// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.42
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class EnemyS extends Schema {
    @type("uint32") public x!: number;
    @type("uint32") public y!: number;
    @type("uint8") public t!: number;
    @type("number") public life!: number;
    @type("number") public speed!: number;
    @type("number") public radius!: number;
    @type("number") public cash!: number;
}
