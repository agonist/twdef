import { Scene } from "phaser";
import BoardPlugin from "phaser3-rex-plugins/plugins/board-plugin";
import Board from "phaser3-rex-plugins/plugins/board/board/LogicBoard";
import Shape from "phaser3-rex-plugins/plugins/board/shape/Shape";
import { TileXYType } from "phaser3-rex-plugins/plugins/board/types/Position";
import { Cellz } from "../../schema/Cellz";
import { World } from "../../schema/World";
import { MainScene } from "../scenes/main-scene";
import { gameState } from "../state/game-state";

enum CellType {
  PATH,
  SPAWN,
  BASE,
  EMPTY,
  LAND,
}

function getCellType(x: number, y: number): CellType {
  const land = gameState.getState().world[y / 40][x / 40];

  if (land.t === 0) {
    return CellType.PATH;
  } else if (land.t === 1) {
    return CellType.SPAWN;
  } else if (land.t === 2) {
    return CellType.BASE;
  } else if (land.t === 3) {
    return CellType.EMPTY;
  } else {
    return CellType.LAND;
  }
}

const defautlBg = 0x22244e;
const defaultLand = 0x1d5543;

export class WorldManager {
  tilemap = new Map<number, Shape>();
  init = false;

  public initGrid(
    world: World,
    scene: Scene,
    rexBoard: BoardPlugin,
    grid: BoardPlugin.Board
  ) {
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
      .forEachTileXY((tileXY, board) => {
        const land = lands[tileXY.y][tileXY.x];

        const points = board.getGridPoints(tileXY.x, tileXY.y, true);
        // graphics.strokePoints(points, false);
        let gridElem: Shape;
        if (land.t === 0) {
          // path
          gridElem = rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            defautlBg,
            0.9
          );
        } else if (land.t === 1) {
          // spawn
          gridElem = rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            0xff0000,
            0.5
          );
        } else if (land.t === 2) {
          // base
          gridElem = rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            0x00dd00,
            0.5
          );
        } else if (land.t === 3) {
          // wall
          gridElem = rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            0x111111,
            0.5
          );
        } else {
          let defaultLand = 0x1d5543;

          if (land.minted) {
            defaultLand = 0x5d4f43;
          }

          gridElem = rexBoard.add.shape(
            board,
            tileXY.x,
            tileXY.y,
            0,
            defaultLand,
            0.5
          );
          this.tilemap.set(land.id, gridElem);
        }
      });

    board
      .setInteractive()
      .on("tileout", function (pointer: any, tileXY: TileXYType) {
        // console.log("out " + tileXY.x + "," + tileXY.y);
      })
      .on("gameobjectdown", function (pointer: any, gameObject: Shape) {
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            // gameObject.setFillStyle(defaultLand, 0.3);
            break;
        }
      })
      .on("gameobjectover", function (pointer: any, gameObject: Shape) {
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            // gameObject.setFillStyle(defaultLand, 0.3);
            break;
        }
      })
      .on("gameobjectout", function (pointer: any, gameObject: Shape) {
        // console.log("game out");
        switch (getCellType(gameObject.x, gameObject.y)) {
          case CellType.LAND:
            // gameObject.setFillStyle(defaultLand, 0.2);
            break;
        }
      })
      .on("tile1tap", function (tap: any, tileXY: TileXYType) {
        gameState.getState().selectLand(tileXY.x, tileXY.y);
      });

    grid = board;
    this.init = true;
  }

  updateTile(cell: Cellz) {
    if (this.init) {
      if (cell.minted) this.tilemap.get(cell.id)?.setFillStyle(0x5d4f43, 0.5);
    }
  }
}
