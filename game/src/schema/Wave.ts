// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.42
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Enemy } from './Enemy'

export class Wave extends Schema {
    @type([ Enemy ]) public enemies: ArraySchema<Enemy> = new ArraySchema<Enemy>();
}
