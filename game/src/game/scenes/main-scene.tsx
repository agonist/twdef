import { gameState } from "../state/game-state";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin.js";
import { Constants } from "../Constants";
import { Client, Room } from "colyseus.js";
import { World } from "../../schema/World";
import { GameState } from "../../schema/GameState";
import { DataChange } from "@colyseus/schema";
import { EnemyManager } from "../manager/EnemyManager";
import { WorldManager } from "../manager/WorldManager";

export class MainScene extends Phaser.Scene {
  private rexBoard!: BoardPlugin;
  private grid!: BoardPlugin.Board;
  private cameraController!: Phaser.Cameras.Controls.SmoothedKeyControl;

  private enemyManager?: EnemyManager;
  private worldManager?: WorldManager;

  client = new Client("ws://localhost:2567");
  room!: Room<GameState>;

  constructor() {
    super(Constants.SCENE_MAIN);
  }

  async create() {
    try {
      this.room = await this.client.joinOrCreate("my_room");
      console.log("Joined successfully!");

      this.enemyManager = new EnemyManager();
      this.enemyManager.init(this.room, this);

      this.worldManager = new WorldManager();

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

  handleWorldUpdate(world: World) {
    const lands: number[][] = [];
    while (world.cells.length) lands.push(world.cells.splice(0, world.width));
    console.log(lands);
    gameState.getState().setWorld(lands);

    this.worldManager?.initGrid(world, this, this.rexBoard, this.grid);
    this.initCamera();
  }

  update(time: any, delta: number) {
    this.cameraController?.update(delta);
    this.enemyManager?.update();

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

      acceleration: 0.06,
      drag: 0.003,
      maxSpeed: 0.3,
    });
    this.cameras.main.centerOn(100, 80);
    this.cameras.main.zoom = 1;
  }
}
