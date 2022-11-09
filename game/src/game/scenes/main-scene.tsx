import { Scene, GameObjects, Cameras, Game } from "phaser";
import { gameState } from "../state/game-state";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin.js";
import Board from "phaser3-rex-plugins/plugins/board/board/Board";
import { TileXYType as TileXYType } from "phaser3-rex-plugins/plugins/board/types/Position";
import { RoundTower } from "../entities/tower/RoudTower";
import Group = Phaser.Physics.Arcade.Group;
import { SimpleTower } from "../entities/tower/SimpleTower";
import { Constants } from "../Constants";
import Shape from "phaser3-rex-plugins/plugins/board/shape/Shape";
import { Client, Room } from "colyseus.js";
import { World } from "../../schema/World";
import { GameState } from "../../schema/GameState";
import { DataChange } from "@colyseus/schema";
import { Data } from "@wagmi/core/dist/declarations/src/client";
import { Wave } from "../../schema/Wave";

enum CellType {
  LAND,
  EMPTY,
}

function getCellType(x: number, y: number): CellType {
  const land = gameState.getState().world[y / 10][x / 10];

  if (land > 0) {
    return CellType.LAND;
  } else return CellType.EMPTY;
}

const defautlBg = 0x22244e;
const defaultLand = 0x1d5543;

export class MainScene extends Phaser.Scene {
  private rexBoard!: BoardPlugin;
  private grid!: BoardPlugin.Board;
  private cameraController!: Phaser.Cameras.Controls.SmoothedKeyControl;

  private tmpTower?: RoundTower;

  client = new Client("ws://localhost:2567");
  room!: Room<GameState>;

  enemies: SimpleTower[] = [];

  constructor() {
    super(Constants.SCENE_MAIN);
  }

  async create() {
    try {
      this.room = await this.client.joinOrCreate("my_room");
      console.log("Joined successfully!");

      this.room.onStateChange((state: GameState) => {
        // console.log("the world state has been updated:", state.world);
        // console.log("the wave state has been updated:", state.waves);
      });

      this.room.state.enemies.onAdd = (enemy, key: number) => {
        console.log("enemy ADDED ");

        const entity = new SimpleTower(this, 10, 10);
        this.enemies.push(entity);

        enemy.onChange = () => {
          entity.setX(enemy.x);
          entity.setY(enemy.y);
        };
      };

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

    // this.tmpTower = new RoundTower(this, 32, 32, 4, 0xff0000, 1);
    // const t2 = new SimpleTower(this, 10, 10);
  }

  handleWorldUpdate(world: World) {
    const lands: number[][] = [];
    while (world.cells.length) lands.push(world.cells.splice(0, world.width));
    gameState.getState().setWorld(lands);

    this.initGrid(world);
    this.initCamera();
  }

  update(time: any, delta: number) {
    this.cameraController?.update(delta);

    var pointer = this.input.activePointer;
    var out = this.grid?.worldXYToTileXY(pointer.worldX, pointer.worldY, true);
  }

  //  INIT STUFF

  private initGrid(world: World) {
    var graphics = this.add.graphics({
      lineStyle: {
        width: 0.2,
        color: 0xffffff,
        alpha: 0.2,
      },
    });

    const quadGridCfg: Board.IConfig = {
      grid: {
        gridType: "quadGrid",
        x: 0,
        y: 0,
        cellWidth: world.cellSize,
        cellHeight: world.cellSize,
        type: "orthogonal",
      },
      width: world.width,
      height: world.height,
    };

    const lands = gameState.getState().world;

    const board = this.rexBoard.add
      .board(quadGridCfg)
      .forEachTileXY(function (tileXY, board) {
        const land = lands[tileXY.y][tileXY.x];

        const points = board.getGridPoints(tileXY.x, tileXY.y, true);
        graphics.strokePoints(points, true);
        const scene = board.scene as MainScene;

        if (land > 0) {
          const gridElem = scene.rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            defaultLand,
            0.9
          );
        } else {
          const gridElem = scene.rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            defautlBg,
            0.9
          );
        }
      });

    board
      .setInteractive()
      .on("tiledown", function (_: any, tileXY: TileXYType) {
        console.log("down " + tileXY.x + "," + tileXY.y);
      })
      .on("tileup", function (_pointer: any, tileXY: TileXYType) {
        console.log("up " + tileXY.x + "," + tileXY.y);
      })
      .on("tilemove", function (pointer: any, tileXY: TileXYType) {
        console.log("move " + tileXY.x + "," + tileXY.y);
      })
      .on("tileover", function (pointer: any, tileXY: TileXYType) {
        console.log("over " + tileXY.x + "," + tileXY.y);
        gameState.getState().selectHoverLand(tileXY.x, tileXY.y);
        // gameState.setState({ pos: { x: tileXY.x, y: tileXY.y } });
        //const scene = board.scene as MainScene;
        //scene.tmpTower?.setPosition(tileXY.x * 10, tileXY.y * 10);
      })
      .on("tileout", function (pointer: any, tileXY: TileXYType) {
        console.log("out " + tileXY.x + "," + tileXY.y);
      })
      .on("gameobjectdown", function (pointer: any, gameObject: Shape) {
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            gameObject.setFillStyle(defaultLand, 0.7);
            break;
          case CellType.EMPTY:
            gameObject.setFillStyle(0xffffff, 0.7);
            break;
        }
      })
      .on("gameobjectover", function (pointer: any, gameObject: Shape) {
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            gameObject.setFillStyle(defaultLand, 1);
            break;
          case CellType.EMPTY:
            gameObject.setFillStyle(0xffffff, 0.2);
            break;
        }
      })
      .on("gameobjectout", function (pointer: any, gameObject: Shape) {
        console.log("game out");
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            gameObject.setFillStyle(defaultLand, 0.9);
            break;
          case CellType.EMPTY:
            gameObject.setFillStyle(defautlBg, 0.9);
            break;
        }
      })
      .on("tile1tap", function (tap: any, tileXY: TileXYType) {
        // element on grid clicked
        console.log("1 tap " + tileXY.x + "," + tileXY.y);
        gameState.getState().selectLand(tileXY.x, tileXY.y);
        // const scene = board.scene as MainScene;
        // new RoundTower(scene, tileXY.x * 10, tileXY.y * 10, 4, 0xff0000, 1);
      });

    this.grid = board;
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
    this.cameras.main.zoom = 4;
  }
}
