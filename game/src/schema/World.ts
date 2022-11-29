// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.42
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Cellz } from './Cellz'

export class World extends Schema {
    @type("uint16") public width!: number;
    @type("uint16") public height!: number;
    @type("uint8") public cellSize!: number;
    @type([ Cellz ]) public cells: ArraySchema<Cellz> = new ArraySchema<Cellz>();
}
