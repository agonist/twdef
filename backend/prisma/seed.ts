import { Cell, CellType, PrismaClient } from "@prisma/client";
import { genFinalMap, makeGrid, makeMap } from "./map-generator";
const prisma = new PrismaClient();

async function main() {
  let c1 = (await prisma.land.count()) + 1;
  await createMap(25, 15, c1);

  let c2 = (await prisma.land.count()) + 1;
  await createMap(25, 25, c2);

  let c3 = (await prisma.land.count()) + 1;
  await createMap(15, 15, c3);
}

async function createMap(width: number, height: number, startId: number) {
  const map1 = await prisma.map.create({
    data: {
      paused: false,
      cells: {},
      width: width,
      height: height,
    },
  });

  let map = makeGrid(width, height, startId);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      await prisma.cell.create({
        data: {
          x: x,
          y: y,
          type: map[y][x] > 0 ? CellType.LAND : CellType.PATH,
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
