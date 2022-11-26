import { mapService } from "../db/MapService";
import { cellSize } from "../rooms/GameRoom";
import { easyAStar } from "../tools/astar";
import { Point } from "../tools/Point";

export class Map {
  mapId: number;
  map: number[];
  grid: number[][] = [];

  spawn: Point;
  base: Point;
  private pathsCache: { [k: string]: Point[] | false } = {};

  width = 0;
  height = 0;

  constructor(id: number, base: { x: number; y: number }) {
    this.mapId = id;
    this.spawn = { x: 0, y: 1 };
    this.base = base;
  }

  async loadMap() {
    const map = await mapService.loadMapById(this.mapId);
    const cells: number[] = [];
    map.cells.forEach((c) => {
      if (c.type === "PATH") {
        cells.push(0);
      } else if (c.type === "LAND") {
        cells.push(c.id);
      }
    });

    this.width = map.width;
    this.height = map.height;
    this.map = cells;

    let tmp: number[] = [...cells];

    while (tmp.length) this.grid.push(tmp.splice(0, this.width));

    console.log(this.grid);
  }

  pathFind(i: number, j: number) {
    return easyAStar(
      (x, y) => {
        return (
          this.grid[y] && this.grid[y][x] !== undefined && this.grid[y][x] === 0
        );
      },
      { x: i, y: j },
      {
        x: this.base.x,
        y: this.base.y,
      }
    );
  }

  getPathFromGridCell(i: number, j: number) {
    const key = `${i}-${j}`;
    const fromCache = this.pathsCache[key];

    if (fromCache !== undefined) {
      return fromCache;
    } else {
      let path = this.pathFind(i, j);

      if (path) {
        path = path.map((value) => ({
          x: value.x * cellSize,
          y: value.y * cellSize,
        }));
      }
      return (this.pathsCache[key] = path);
    }
  }

  invalidatePathsCache() {
    this.pathsCache = {};
  }
}
