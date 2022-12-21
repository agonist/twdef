import { Land, Tower, TowerType } from "@prisma/client";
import { TSMT$Bin } from "../tools/binning";
import { prisma } from "./DbService";

class TowerService {
  damagebinning: TSMT$Bin = new TSMT$Bin();
  speedBinning: TSMT$Bin = new TSMT$Bin();

  constructor() {
    this.damagebinning.create([
      { percentage: 10, action: 22 },
      { percentage: 10, action: 24 },
      { percentage: 50, action: 25 },
      { percentage: 10, action: 27 },
      { percentage: 10, action: 28 },
      { percentage: 10, action: 30 },
    ]);

    this.speedBinning.create([
      { percentage: 10, action: 380 },
      { percentage: 10, action: 390 },
      { percentage: 50, action: 400 },
      { percentage: 10, action: 410 },
      { percentage: 10, action: 420 },
      { percentage: 10, action: 425 },
    ]);
  }

  async findTowerById(id: number): Promise<Tower> {
    return await prisma.tower.findUnique({ where: { id: id } });
  }

  async createTower(id: number, type: number): Promise<Tower> {
    const damage = this.getDammage();
    const speed = this.getSpeed();

    const tower = await prisma.tower.create({
      data: {
        id: id,
        damage: damage,
        speed: speed,
        level: 1,
        type: TowerType.FIRE,
      },
    });
    return tower;
  }

  getDammage() {
    return this.damagebinning.nextAction();
  }

  getSpeed() {
    return this.speedBinning.nextAction();
  }
}

export const towerService = new TowerService();
