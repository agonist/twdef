import { Land } from "@prisma/client";
import { TSMT$Bin } from "../tools/binning";
import { prisma } from "./DbService";

class LandService {
  damagebinning: TSMT$Bin = new TSMT$Bin();
  towerType: TSMT$Bin = new TSMT$Bin();

  constructor() {
    this.damagebinning.create([
      { percentage: 10, action: 0 },
      { percentage: 8, action: 1 },
      { percentage: 8, action: 2 },
      { percentage: 7, action: 3 },
      { percentage: 6, action: 4 },
      { percentage: 5, action: 5 },
      { percentage: 4, action: 6 },
      { percentage: 4, action: 7 },
      { percentage: 4, action: 8 },
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

    this.towerType.create([
      { percentage: 33, action: 1 },
      { percentage: 33, action: 2 },
      { percentage: 33, action: 3 },
    ]);
  }

  async findLandById(id: number, includeCell: boolean = false): Promise<Land> {
    return await prisma.land.findUnique({
      where: { id: id },
      include: { Cell: includeCell },
    });
  }

  async findLandByIdwithCell(id: number) {
    return await prisma.land.findUnique({
      where: { id: id },
      include: { Cell: true },
    });
  }

  async updateLandToMinted(id: number) {
    const damageBonus = this.damagebinning.nextAction();
    const type = this.towerType.nextAction();

    await prisma.land.update({ where: { id: id }, data: { minted: true } });
  }
}

export const landService = new LandService();
