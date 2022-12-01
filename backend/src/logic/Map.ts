import { mapService } from "../db/MapService";
import { cellSize } from "../rooms/GameRoom";
import { easyAStar } from "../tools/astar";
import { Point } from "../tools/Point";

export class Map {
  // map id as in the db
  mapId: number;

  // map data before being split as a grid
  map: { t: number; id?: number; minted?: boolean }[] = [];

  // map data as a grid
  grid: { t: number; id?: number; minted?: boolean }[][] = [];

  spawn: Point;
  base: Point;

  width = 0;
  height = 0;

  private pathsCache: { [k: string]: Point[] | false } = {};

  constructor(id: number) {
    this.mapId = id;
  }

  async loadMap() {
    const map = await mapService.loadMapById(this.mapId);

    map.cells.forEach((c) => {
      if (c.type === "PATH") {
        this.map.push({ t: 0 });
      } else if (c.type === "BASE") {
        this.map.push({ t: 2 });
        this.base = { x: c.x, y: c.y };
      } else if (c.type === "SPAWN") {
        this.map.push({ t: 1 });
        this.spawn = { x: c.x, y: c.y };
      } else if (c.type === "ROCK") {
        this.map.push({ t: 3 });
      } else if (c.type === "LAND") {
        this.map.push({ t: 4, id: c.land.id, minted: c.land.minted });
      }
    });

    this.width = map.width;
    this.height = map.height;

    let tmp = [...this.map];

    while (tmp.length) this.grid.push(tmp.splice(0, this.width));
  }

  pathFind(i: number, j: number) {
    return easyAStar(
      (x, y) => {
        return (
          this.grid[y] &&
          this.grid[y][x] !== undefined &&
          (this.grid[y][x].t === 0 ||
            this.grid[y][x].t === 1 ||
            this.grid[y][x].t === 2)
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
