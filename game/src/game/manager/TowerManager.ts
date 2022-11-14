import { Room } from "colyseus.js";
import { Scene } from "phaser";
import { GameState } from "../../schema/GameState";
import { RoundTower } from "../entities/tower/RoudTower";
import { SimpleTower } from "../entities/tower/SimpleTower";
import { Tower } from "../entities/tower/Tower";

export class TowerManger {
    towers: Tower[] = []

    constructor(){}

    init(room: Room<GameState>, scene: Scene){
        room.state.towers.onAdd = (tower, key: number) => {
            let entity: Tower

            switch(tower.t) {
                case 0: {
                    entity = new SimpleTower(scene, tower.x, tower.y)
                    break;
                }
                case 1: {
                      entity = new RoundTower(scene, tower.x, tower.y)
                    break;
                }
                default: {
                    entity = new SimpleTower(scene, tower.x, tower.y)
                    break
                }
            }

            this.towers.push(entity)

            tower.onChange = () => {
                 entity.setData("serverX", tower.x);
                entity.setData("serverY", tower.y);
            }

        }
    }

 update() {
    this.towers.forEach((tower) => {
      const { serverX, serverY } = tower.data.values;
      tower.x =  serverX;
      tower.y =  serverY;
    });
  }
}