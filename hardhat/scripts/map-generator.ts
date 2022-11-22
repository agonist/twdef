
export function makeGrid(width: number, height: number, startId: number): number[][]{

     let map = makeMap(width, height, startId)
     let tmp: number[] = [...map]
     let grid: number[][] = []

     while (tmp.length) grid.push(tmp.splice(0, width));

     return grid
}

export function makeMap(width: number, height: number, startId: number): number[] {
    let map: number[] = []

    let id = startId
    let ground = false
    let paddRight = true

    for (let y = 0; y <  height; y++){
        for (let x = 0; x <  width; x++) {

            if (y === 0 || y ===  width){
                map.push(id)
                id++
                ground = true
            }  else {

            if (ground){
                map.push(0)
                if (x ===  width - 1) ground = false
            } else {
                if (paddRight) {
                    if (x ===  width - 1) {
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
                    if (x ===  width - 1) {
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