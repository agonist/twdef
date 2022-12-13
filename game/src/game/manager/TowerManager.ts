import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { RoundTower } from "../entities/tower/RoudTower";
import { SimpleTower } from "../entities/tower/SimpleTower";
import { Tower } from "../entities/tower/Tower";

export class TowerManger {
  towersGroup?: Phaser.GameObjects.Group;

  constructor() {}

  init(room: Room<GameState>, scene: Scene) {
    this.towersGroup = scene.add.group({
      classType: SimpleTower,
      runChildUpdate: true,
    });

    room.state.towers.onAdd = (tower, key: number) => {
      let entity: Tower;

      switch (tower.t) {
        case 0: {
          entity = this.towersGroup?.get(tower.x, tower.y);
          // entity = new SimpleTower(scene, tower.x, tower.y)
          break;
        }
        case 1: {
          entity = new RoundTower(scene, tower.x, tower.y);
          break;
        }
        default: {
          entity = new SimpleTower(scene, tower.x, tower.y);
          break;
        }
      }
      entity.visible = true;
      entity.active = true;

      tower.onRemove = () => {
        this.towersGroup?.killAndHide(entity);
      };

      //this.towers.push(entity)

      tower.onChange = () => {
        entity.setData("serverX", tower.x);
        entity.setData("serverY", tower.y);
      };
    };
  }
}
