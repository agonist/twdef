import { Schema, Context, type, ArraySchema } from "@colyseus/schema";

// enemy type
// 0 => simple
// 1 => fast
// 2 => armored
// 3 => healer
// 4 => boss

export class EnemyS extends Schema {
  @type("uint16") x: number;
  @type("uint16") y: number;
  @type("uint8") t: number; // type
}

export class TowerS extends Schema {
  @type("uint8") id: number;
  @type("uint16") x: number;
  @type("uint16") y: number;
  @type("uint8") t: number;
}

export class BulletS extends Schema {
  @type("uint16") x: number;
  @type("uint16") y: number;

  
}

export class Wave extends Schema {
  @type([EnemyS]) enemies = new ArraySchema<EnemyS>();
}

export class Cellz extends Schema {
  // 0 = floor, 1 = spawn, 2 = base, 3 =  empty, 4 = land
  @type("uint8") t: number;
  @type("uint32") id?: number;
  @type("boolean") minted?: boolean;
}

export class Wavez extends Schema {
  @type("uint32") count: number;
  @type("number") multiplier: number;
}

class World extends Schema {
  // in cells
  @type("uint16") width: number;
  @type("uint16") height: number;
  // in pixels, so a 10 x 10 map would be 100 x 100
  @type("uint8") cellSize: number;
  @type([Cellz]) cells = new ArraySchema<Cellz>();
}

export class GameState extends Schema {
  @type(World) world: World = new World();
  @type(Wavez) wave: Wavez = new Wavez();

  @type([EnemyS]) enemies = new ArraySchema<EnemyS>();
  @type([TowerS]) towers = new ArraySchema<TowerS>();
  @type([BulletS]) bullets = new ArraySchema<BulletS>();
}
