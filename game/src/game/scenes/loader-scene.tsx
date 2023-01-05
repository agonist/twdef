import { Constants } from "../Constants";
import { gameState } from "../state/game-state";

export class LoaderScene extends Phaser.Scene {
  constructor() {
    super(Constants.SCENE_LOADER);
  }

  preload() {
    this.load.image(Constants.SIMPLE_TOWER_ICE, "assets/tower/tower_ice.png");
    this.load.image(Constants.SIMPLE_TOWER_FIRE, "assets/tower/tower_fire.png");
    this.load.image(Constants.SIMPLE_TOWER_JUNGLE, "assets/tower/tower_jungle.png");

    this.load.image(Constants.SIMPLE_BULLET, "assets/SimpleBullet.png");
    this.load.image(Constants.SIMPLE_ENEMY, "assets/enemy/simple_enemy.png");
    this.load.image(Constants.FAST_ENEMY, "assets/enemy/fast_enemy.png");
    this.load.image(Constants.ARMORED_ENEMY, "assets/enemy/armored_enemy.png");
    this.load.image(Constants.HEALER_ENEMY, "assets/enemy/healer_enemy.png");
    this.load.image(Constants.BOSS_ENEMY, "assets/enemy/boss_enemy.png");
  }

  create() {
    this.scene.start(Constants.SCENE_MAIN);
  }

  launchMainScene() {
    this.scene.start(Constants.SCENE_MAIN);
  }
}
