import {
  Cell,
  CellType,
  LandType,
  PrismaClient,
  TowerType,
} from "@prisma/client";
import {
  genFinalMap,
  makeGrid,
  makeGridFromFileMap,
  makeMap,
} from "./map-generator";

import { TSMT$Bin } from "../src/tools/binning";
import { betaMap } from "./map/beta_map";

const prisma = new PrismaClient();
let damagebinning: TSMT$Bin = new TSMT$Bin();
let towerType: TSMT$Bin = new TSMT$Bin();

async function main() {
  damagebinning.create([
    { percentage: 10, action: 0 },
    { percentage: 8, action: 1 },
    { percentage: 8, action: 2 },
    { percentage: 7, action: 3 },
    { percentage: 6, action: 4 },
    { percentage: 5, action: 5 },
    { percentage: 4, action: 6 },
    { percentage: 4, action: 7 },
    { percentage: 3, action: 8 },
    { percentage: 3, action: 9 },
    { percentage: 3, action: 10 },
    { percentage: 3, action: 11 },
    { percentage: 3, action: 12 },
    { percentage: 3, action: 13 },
    { percentage: 3, action: 14 },
    { percentage: 3, action: 15 },
    { percentage: 2, action: 16 },
    { percentage: 2, action: 17 },
    { percentage: 2, action: 18 },
    { percentage: 2, action: 19 },
    { percentage: 2, action: 20 },
    { percentage: 2, action: 21 },
    { percentage: 2, action: 22 },
    { percentage: 2, action: 23 },
    { percentage: 2, action: 24 },
    { percentage: 1, action: 25 },
    { percentage: 1, action: 26 },
    { percentage: 1, action: 27 },
    { percentage: 1, action: 28 },
    { percentage: 1, action: 29 },
    { percentage: 1, action: 30 },
  ]);

  towerType.create([
    { percentage: 33, action: 1 },
    { percentage: 33, action: 2 },
    { percentage: 34, action: 3 },
  ]);

  let c1 = (await prisma.land.count()) + 1;
  await createMap(betaMap, 26, 30, c1);

  // let c2 = (await prisma.land.count()) + 1;
  // await createMap(map_2, 15, 25, c2);

  // let c3 = (await prisma.land.count()) + 1;
  // await createMap(map_3, 15, 15, c3);
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

  const allData: any[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const r = getRandomType();
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
                    type: r?.type,
                    imgUrl: r?.img,
                    damageBonus: damagebinning.nextAction(),
                  },
                }
              : undefined,
        },
      });
      // const data = {
      //   x: x,
      //   y: y,
      //   type: getMapType(map[y][x]),
      //   mapId: map1.id,
      //   land:
      //     map[y][x] > 0
      //       ? {
      //           create: {
      //             id: map[y][x],
      //             minted: false,
      //             type: r?.type,
      //             imgUrl: r?.img,
      //             damageBonus: damagebinning.nextAction(),
      //           },
      //         }
      //       : undefined,
      // };
      // allData.push(data);
    }
  }
  const count = await prisma.land.count();
  console.log("We have " + count + " land");

  const towers: any[] = [];
  for (let i = 1; i < count; i++) {
    const r = Math.random();
    let t: TowerType = TowerType.FIRE;
    if (r > 0.3) t = TowerType.ICE;
    if (r > 0.6) t = TowerType.JUNGLE;

    const data = {
      id: i,
      damage: 25,
      speed: 400,
      level: 1,
      type: t,
      imgUrl: "",
    };
    towers.push(data);
  }

  await prisma.tower.createMany({ data: towers });

  for (let i = 1; i < count; i++) {
    const land = await prisma.land.findUnique({
      where: { id: i },
      include: { Cell: true },
    });

    const inGame = await prisma.inGame.create({
      data: {
        towerId: i,
        landId: i,
        mapId: land!.Cell.mapId,
        x: land!.Cell.x,
        y: land!.Cell.y,
        owner: "0x0000",
      },
    });
  }
  // await prisma.cell.createMany({
  //   data: allData,
  // });
}

function getRandomType() {
  const type = towerType.nextAction();
  switch (type) {
    case 1: {
      return {
        type: LandType.FIRE,
        img: "https://ipfs.filebase.io/ipfs/QmdFEidi7obndinYTcFKuYhkofXYcXR7VFFgTrsdCcxkwB/QmX6vmM5KX6FMyXWvm4MxJDGnghWKbj1VpsB8k3W5JXLq5",
      };
    }
    case 2: {
      return {
        type: LandType.ICE,
        img: "https://ipfs.filebase.io/ipfs/QmdFEidi7obndinYTcFKuYhkofXYcXR7VFFgTrsdCcxkwB/QmfNWD8EW7zzjDAWjPfrXRBx8GUEpPWzLawxpdBSBvewhZ",
      };
    }
    case 3: {
      return {
        type: LandType.JUNGLE,
        img: "https://ipfs.filebase.io/ipfs/QmdFEidi7obndinYTcFKuYhkofXYcXR7VFFgTrsdCcxkwB/QmTJAgUMdaRnmoDFwNW8SefjzHN3md96VqTHqpCVRoUjeG",
      };
    }
  }
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
