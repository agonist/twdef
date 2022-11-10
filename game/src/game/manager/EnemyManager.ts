import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { Enemy } from "../entities/enemy/Enemy";
import { FastEnemy } from "../entities/enemy/FastEnemy";
import { SimpleEnemy } from "../entities/enemy/SimpleEnemy";

export class EnemyManager {
  enemies: Enemy[] = [];

  constructor() {}

  init(room: Room<GameState>, scene: Scene) {
    room.state.enemies.onAdd = (enemy, key: number) => {
      let entity: Enemy;

      if (enemy.t === 0) {
        entity = new SimpleEnemy(scene, 10, 10);
      } else if (enemy.t === 1) {
        entity = new FastEnemy(scene, 10, 10);
      } else {
        entity = new SimpleEnemy(scene, 10, 10);
      }

      this.enemies.push(entity);

      enemy.onChange = () => {
        entity.setData("serverX", enemy.x);
        entity.setData("serverY", enemy.y);
      };
    };
  }

  update() {
    this.enemies.forEach((enemy) => {
      const { serverX, serverY } = enemy.data.values;

      enemy.x = Phaser.Math.Linear(enemy.x, serverX, 0.2);
      enemy.y = Phaser.Math.Linear(enemy.y, serverY, 0.2);
    });
  }
}