import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { FireTower } from "../entities/tower/FireTower";
import { IceTower } from "../entities/tower/IceTower";
import { JungleTower } from "../entities/tower/JungleTower";
import { Tower } from "../entities/tower/Tower";

export class TowerManger {
  fireTowersGroup?: Phaser.GameObjects.Group;
  iceTowerGroup?: Phaser.GameObjects.Group;
  jungleTowerGroup?: Phaser.GameObjects.Group;

  constructor() {}

  init(room: Room<GameState>, scene: Scene) {
    this.fireTowersGroup = scene.add.group({
      classType: FireTower,
      runChildUpdate: true,
    });

    this.iceTowerGroup = scene.add.group({
      classType: IceTower,
      runChildUpdate: true,
    });

    this.jungleTowerGroup = scene.add.group({
      classType: JungleTower,
      runChildUpdate: true,
    });

    room.state.towers.onAdd = (tower, key: number) => {
      let entity: Tower;

      switch (tower.t) {
        case 0: {
          entity = this.fireTowersGroup?.get(tower.x, tower.y);
          break;
        }
        case 1: {
          entity = this.iceTowerGroup?.get(tower.x, tower.y);
          break;
        }
        case 2: {
          entity = this.jungleTowerGroup?.get(tower.x, tower.y);
          break;
        }
        default: {
          entity = this.fireTowersGroup?.get(tower.x, tower.y);
          break;
        }
      }
      entity.visible = true;
      entity.active = true;

      tower.onRemove = () => {
        switch (tower.t) {
          case 0: {
            this.fireTowersGroup?.killAndHide(entity);
            break;
          }
          case 1: {
            this.iceTowerGroup?.killAndHide(entity);
            break;
          }
          case 2: {
            this.fireTowersGroup?.killAndHide(entity);
            break;
          }
          default: {
            this.fireTowersGroup?.killAndHide(entity);
            break;
          }
        }
        entity.visible = false;
        entity.active = false;
      };

      //this.towers.push(entity)

      tower.onChange = () => {
        entity.setData("serverX", tower.x);
        entity.setData("serverY", tower.y);
      };
    };
  }
}
