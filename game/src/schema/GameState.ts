// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.42
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { World } from './World'
import { Wavez } from './Wavez'
import { EnemyS } from './EnemyS'
import { TowerS } from './TowerS'
import { BulletS } from './BulletS'

export class GameState extends Schema {
    @type(World) public world: World = new World();
    @type(Wavez) public wave: Wavez = new Wavez();
    @type([ EnemyS ]) public enemies: ArraySchema<EnemyS> = new ArraySchema<EnemyS>();
    @type([ TowerS ]) public towers: ArraySchema<TowerS> = new ArraySchema<TowerS>();
    @type([ BulletS ]) public bullets: ArraySchema<BulletS> = new ArraySchema<BulletS>();
}
