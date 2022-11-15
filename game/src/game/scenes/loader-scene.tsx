import { Constants } from "../Constants";
import { gameState } from "../state/game-state";

export class LoaderScene extends Phaser.Scene {
  constructor() {
    super(Constants.SCENE_LOADER);
  }

  create() {
    this.scene.start(Constants.SCENE_MAIN);
  }

  launchMainScene() {
    this.scene.start(Constants.SCENE_MAIN);
  }
}
