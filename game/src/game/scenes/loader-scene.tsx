import { Constants } from "../Constants";
import { gameState } from "../state/game-state";

export class LoaderScene extends Phaser.Scene {
  constructor() {
    super(Constants.SCENE_LOADER);
  }

  create() {}

  launchMainScene() {
    this.scene.start(Constants.SCENE_MAIN);
  }
}
