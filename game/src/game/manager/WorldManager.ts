import { Scene } from "phaser";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Board from "phaser3-rex-plugins/plugins/board/board/LogicBoard";
import Shape from "phaser3-rex-plugins/plugins/board/shape/Shape";
import { TileXYType } from "phaser3-rex-plugins/plugins/board/types/Position";
import { World } from "../../schema/World";
import { MainScene } from "../scenes/main-scene";
import { gameState } from "../state/game-state";


enum CellType {
  LAND,
  EMPTY,
}

function getCellType(x: number, y: number): CellType {
  const land = gameState.getState().world[y / 40][x / 40];

  if (land > 0) {
    return CellType.LAND;
  } else return CellType.EMPTY;
}

const defautlBg = 0x22244e;
const defaultLand = 0x1d5543;

export class WorldManager {


public initGrid(world: World, scene: Scene, rexBoard: BoardPlugin, grid: BoardPlugin.Board) {
    var graphics = scene.add.graphics({
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

    const board = rexBoard.add
      .board(quadGridCfg)
      .forEachTileXY( (tileXY, board) => {
        const land = lands[tileXY.y][tileXY.x];

        const points = board.getGridPoints(tileXY.x, tileXY.y, true);
        // graphics.strokePoints(points, false);
        const scene = board.scene as MainScene;

        if (land > 0) {
          const gridElem = rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            defaultLand,
            0.2
          );
        } else {
          const gridElem = rexBoard.add.shape(
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
            gameObject.setFillStyle(defaultLand, 0.3);
            break;
          case CellType.EMPTY:
            gameObject.setFillStyle(defautlBg, 0.8);
            break;
        }
      })
      .on("gameobjectover", function (pointer: any, gameObject: Shape) {
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            gameObject.setFillStyle(defaultLand, 0.3);
            break;
          case CellType.EMPTY:
            gameObject.setFillStyle(defautlBg, 0.8);
            break;
        }
      })
      .on("gameobjectout", function (pointer: any, gameObject: Shape) {
        console.log("game out");
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            gameObject.setFillStyle(defaultLand, 0.2);
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
      });

    grid = board;
  }
}