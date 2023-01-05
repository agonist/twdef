import { Scene } from "phaser";
import { Constants } from "../../Constants";
import { Tower } from "./Tower";

export class FireTower extends Tower {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, Constants.SIMPLE_TOWER_FIRE);
  }
}
