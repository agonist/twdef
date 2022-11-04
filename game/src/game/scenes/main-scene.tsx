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

enum CellType {
  LAND,
  EMPTY,
}

function getCellType(x: number, y: number): CellType {
  const land = gameState
    .getState()
    .lands.find((l) => l.x * 10 === x && l.y * 10 === y);

  if (land != undefined) {
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

  constructor() {
    super(Constants.SCENE_MAIN);
  }

  create() {
    this.initGrid();
    this.initCamera();

    // this.tmpTower = new RoundTower(this, 32, 32, 4, 0xff0000, 1);
    // const t2 = new SimpleTower(this, 10, 10);
  }

  update(time: any, delta: number) {
    this.cameraController.update(delta);

    var pointer = this.input.activePointer;
    var out = this.grid.worldXYToTileXY(pointer.worldX, pointer.worldY, true);
  }

  //  INIT STUFF

  private initGrid() {
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
        cellWidth: 10,
        cellHeight: 10,
        type: "orthogonal",
      },
      width: 100,
      height: 100,
    };

    const lands = gameState.getState().lands;

    const board = this.rexBoard.add
      .board(quadGridCfg)
      .forEachTileXY(function (tileXY, board) {
        const land = lands.find((l) => l.x === tileXY.x && l.y === tileXY.y);

        const points = board.getGridPoints(tileXY.x, tileXY.y, true);
        graphics.strokePoints(points, true);
        const scene = board.scene as MainScene;

        if (land) {
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
