import { Cell, CellType, PrismaClient } from "@prisma/client";
import {
  genFinalMap,
  makeGrid,
  makeGridFromFileMap,
  makeMap,
} from "./map-generator";
import { map_1 } from "./map/map1";
import { map_2 } from "./map/map2";
import { map_3 } from "./map/map3";
const prisma = new PrismaClient();

async function main() {
  let c1 = (await prisma.land.count()) + 1;
  await createMap(map_1, 30, 20, c1);

  let c2 = (await prisma.land.count()) + 1;
  await createMap(map_2, 15, 25, c2);

  let c3 = (await prisma.land.count()) + 1;
  await createMap(map_3, 15, 15, c3);
}

async function createMap(
  mapData: number[],
  width: number,
  height: number,
  startId: number
) {
  const map1 = await prisma.map.create({
    data: {
      paused: false,
      cells: {},
      width: width,
      height: height,
    },
  });

  let map = makeGridFromFileMap(mapData, width, height, startId);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      await prisma.cell.create({
        data: {
          x: x,
          y: y,
          type: getMapType(map[y][x]),
          mapId: map1.id,
          land:
            map[y][x] > 0
              ? {
                  create: {
                    id: map[y][x],
                    minted: false,
                  },
                }
              : undefined,
        },
      });
    }
  }

  //   const updateMapWithCells = async () => {
  //     const cellss = await prisma.cell.findMany({ where: { mapId: 1 } });

  //     let cellId: { id: number }[] = [];
  //     cellss.forEach((c: Cell) => cellId.push({ id: c.id }));

  //     await prisma.map.update({
  //       where: { id: 1 },
  //       data: {
  //         cells: { connect: cellId },
  //       },
  //     });
  //   };
}

function getMapType(t: number) {
  if (t === 0) return CellType.PATH;
  else if (t === -1) return CellType.BASE;
  else if (t === -2) return CellType.SPAWN;
  else if (t === -3) return CellType.ROCK;
  else return CellType.LAND;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
