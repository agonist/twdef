import { cellSize } from "../rooms/GameRoom"
import { easyAStar } from "../tools/astar"
import { Point } from "../tools/Point"

 export class Map {

      map: number[]
      grid: number[][] = []

      spawn: Point
      base: Point
      private pathsCache: { [k: string]: Point[] | false } = {}

      width = 0
      height = 0

    constructor(width: number, height: number, startId: number, base: {x: number, y: number}){
        this.width = width
        this.height = height
        this.spawn = {x: 0, y: 1}
        this.base =  base

        this.map = this.makeMap(startId)

        let tmp: number[] = [...this.map]

        while (tmp.length) this.grid.push(tmp.splice(0, this.width));
    }

    pathFind(i: number, j: number) {
        return easyAStar(
            (x, y) => {
                return this.grid[y] && this.grid[y][x] !== undefined && (this.grid[y][x] === 0)
            },
            {x: i, y: j},
            {
                x: this.base.x,
                y: this.base.y
            }
        )
    }

    getPathFromGridCell(i: number, j: number) {
        const key = `${i}-${j}`;
        const fromCache = this.pathsCache[key];

        if (fromCache !== undefined) {
            return fromCache;
        } else {
            let path = this.pathFind(i, j);

            if (path) {
                path = path.map(value => ({
                    x: value.x * cellSize,
                    y: value.y * cellSize
                }));
            }
            return this.pathsCache[key] = path;
        }
    }

    invalidatePathsCache() {
        this.pathsCache = {};
    }

makeMap(startId: number): number[] {
    let map: number[] = []

    let id = startId
    let ground = false
    let paddRight = true

    for (let y = 0; y <  this.height; y++){
        for (let x = 0; x <  this.width; x++) {

            if (y === 0 || y ===  this.width){
                map.push(id)
                id++
                ground = true
            }  else {

            if (ground){
                map.push(0)
                if (x ===  this.width - 1) ground = false
            } else {
                if (paddRight) {
                    if (x ===  this.width - 1) {
                        map.push(0)
                        paddRight = false
                        ground = true
                    } else {
                        map.push(id)
                        id++
                    }
                } else {
                    if (x === 0) {
                        map.push(0)
                    } else {
                        map.push(id)
                        id++
                    }
                    if (x ===  this.width - 1) {
                        paddRight = true
                        ground = true
                    }
                }
            }
            }
        }
    }
    return map
}
}