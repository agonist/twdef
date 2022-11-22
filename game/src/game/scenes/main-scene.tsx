import { gameState } from "../state/game-state";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin.js";
import { Constants } from "../Constants";
import { Client, Room } from "colyseus.js";
import { World } from "../../schema/World";
import { GameState } from "../../schema/GameState";
import { DataChange } from "@colyseus/schema";
import { EnemyManager } from "../manager/EnemyManager";
import { WorldManager } from "../manager/WorldManager";
import { TowerManger } from "../manager/TowerManager";
import { BulletManager } from "../manager/BulletManager";

export const cellSize = 40;

export class MainScene extends Phaser.Scene {
  private rexBoard!: BoardPlugin;
  private grid!: BoardPlugin.Board;
  private cameraController!: Phaser.Cameras.Controls.SmoothedKeyControl;

  private enemyManager?: EnemyManager;
  private worldManager?: WorldManager;
  private towerManager?: TowerManger;
  private bulletManager?: BulletManager;

  // client = new Client("ws://updeon.colyseus.de");
  client = new Client("ws://localhost:2567");

  room!: Room<GameState>;

  map!: string;

  constructor() {
    super(Constants.SCENE_MAIN);
  }

  init(data: any) {
    this.map = data.map;
    if (this.map === undefined) {
      this.map = "map_1";
    }
  }

  async create() {
    try {
      this.room = await this.client.joinOrCreate(this.map);

      this.worldManager = new WorldManager();

      this.enemyManager = new EnemyManager();
      this.enemyManager.init(this.room, this);

      this.towerManager = new TowerManger();
      this.towerManager.init(this.room, this);

      this.bulletManager = new BulletManager();
      this.bulletManager.init(this.room, this);

      this.room.state.onChange = (changes) => {
        changes.forEach((change) => {
          switch (change.field) {
            case "world": {
              const world = (change as DataChange<World>).value;
              this.handleWorldUpdate(world);
              break;
            }
          }
        });
      };
    } catch (e) {
      console.error(e);
    }
  }

  async launch(map: string) {
    this.room.removeAllListeners();
    this.room.leave();
    this.scene.restart({ map: map });
  }

  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  handleWorldUpdate(world: World) {
    const lands: number[][] = [];
    while (world.cells.length) lands.push(world.cells.splice(0, world.width));
    gameState.getState().setWorld(lands);

    this.worldManager?.initGrid(world, this, this.rexBoard, this.grid);
    this.initCamera();
  }

  update(time: any, delta: number) {
    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }
  }

  fixedTick(time: any, delta: number) {
    this.cameraController?.update(delta);
    // this.towerManager?.update();

    var pointer = this.input.activePointer;
    var out = this.grid?.worldXYToTileXY(pointer.worldX, pointer.worldY, true);
  }

  private initCamera() {
    var cursors = this.input.keyboard.createCursorKeys();
    this.cameraController = new Phaser.Cameras.Controls.SmoothedKeyControl({
      camera: this.cameras.main,

      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),

      acceleration: 0.12,
      drag: 0.003,
      maxSpeed: 1,
    });
    this.cameras.main.centerOn(500, 350);
    this.cameras.main.zoom = 1;
  }
}
