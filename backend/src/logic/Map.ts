import { cellSize } from "../rooms/GameRoom"
import { easyAStar } from "../tools/astar"
import { Point } from "../tools/Point"

 class Map {

      map: number[]
      grid: number[][] = []

      spawn: Point
      base: Point
      private pathsCache: { [k: string]: Point[] | false } = {}

    constructor(){
        this.spawn = {x: 0, y: 1}
        this.base = {x: 99, y: 99}

        this.map = this.makeMap()

        console.log(this.map.filter(n => n > 0).length)

        let tmp: number[] = [...this.map]

        while (tmp.length) this.grid.push(tmp.splice(0, 100));
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

    makeMap(): number[] {
    let map: number[] = []

    let id = 1
    let ground = false
    let paddRight = true

    for (let y = 0; y < 100; y++){
        for (let x = 0; x < 100; x++) {

            if (y === 0 || y === 100){
                map.push(id)
                id++
                ground = true
            }  else {

            if (ground){
                map.push(0)
                if (x === 99) ground = false
            } else {
                if (paddRight) {
                    if (x === 99) {
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
                    if (x === 99) {
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

const map = new Map();
export {
    map,
    Map
}