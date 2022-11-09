// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.42
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { World } from './World'
import { Enemy } from './Enemy'

export class GameState extends Schema {
    @type(World) public world: World = new World();
    @type([ Enemy ]) public enemies: ArraySchema<Enemy> = new ArraySchema<Enemy>();
}
