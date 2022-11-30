import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { ArmoredEnemy } from "../entities/enemy/ArmoredEnemy";
import { BossEnemy } from "../entities/enemy/BossEnemy";
import { Enemy } from "../entities/enemy/Enemy";
import { FastEnemy } from "../entities/enemy/FastEnemy";
import { HealerEnemy } from "../entities/enemy/HealerEnemy";
import { SimpleEnemy } from "../entities/enemy/SimpleEnemy";

export class EnemyManager {
  simpleEnemyGroup?: Phaser.GameObjects.Group;
  fastEnemyGroup?: Phaser.GameObjects.Group;
  armoredEnemyGroup?: Phaser.GameObjects.Group;
  healerEnemyGroup?: Phaser.GameObjects.Group;
  bossEnemyGroup?: Phaser.GameObjects.Group;

  init(room: Room<GameState>, scene: Scene) {
    this.simpleEnemyGroup = scene.add.group({
      classType: SimpleEnemy,
      runChildUpdate: true,
    });

    this.fastEnemyGroup = scene.add.group({
      classType: FastEnemy,
      runChildUpdate: true,
    });

    this.armoredEnemyGroup = scene.add.group({
      classType: ArmoredEnemy,
      runChildUpdate: true,
    });

    this.healerEnemyGroup = scene.add.group({
      classType: HealerEnemy,
      runChildUpdate: true,
    });

    this.bossEnemyGroup = scene.add.group({
      classType: BossEnemy,
      runChildUpdate: true,
    });

   

    room.state.enemies.onAdd = (enemy, key: number) => {
      let entity: Enemy;

      if (enemy.t === 0) {
        entity = this.simpleEnemyGroup?.get(enemy.x, enemy.y);
      } else if (enemy.t === 1) {
        entity = this.fastEnemyGroup?.get(enemy.x, enemy.y);
      } else if (enemy.t === 2) {
        entity = this.armoredEnemyGroup?.get(enemy.x, enemy.y);
      } else if (enemy.t === 3) {
        entity = this.healerEnemyGroup?.get(enemy.x, enemy.y);
      } else if (enemy.t === 4) {
        entity = this.bossEnemyGroup?.get(enemy.x, enemy.y);
      } else {
        entity = this.simpleEnemyGroup?.get(enemy.x, enemy.y);
      }
      entity.visible = true;
      entity.active = true;

      enemy.onChange = () => {
        entity.setData("serverX", enemy.x);
        entity.setData("serverY", enemy.y);
      };
      enemy.onRemove = () => {
        if (enemy.t === 0) {
          this.simpleEnemyGroup?.killAndHide(entity);
        } else if (enemy.t === 1) {
          this.fastEnemyGroup?.killAndHide(entity);
        } else if (enemy.t === 2) {
          this.armoredEnemyGroup?.killAndHide(entity);
        } else if (enemy.t === 3) {
          this.healerEnemyGroup?.killAndHide(entity);
        } else if (enemy.t === 4) {
          this.bossEnemyGroup?.killAndHide(entity);
        }
      };
    };
  }
}
